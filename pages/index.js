import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SplitPane from "react-split-pane";

import { CssEditor, HtmlEditor, JavascriptEditor } from "../components/editors";
import { useDebounce } from "../utils/useDebounce";

import styles from "./index.module.css";

const Index = () => {
  const [heightValue, setHeightValue] = useState("485px");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [htmlValue, setHtmlValue] = useState("");
  const [jsValue, setJsValue] = useState("");
  const [cssValue, setCssValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const debouncedHtml = useDebounce(htmlValue, 1000);
  const debouncedJs = useDebounce(jsValue, 1000);
  const debouncedCss = useDebounce(cssValue, 1000);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`../api/pens/${id}`);
      const { data } = await response.json();

      if (response.status !== 200) {
        await router.push("/404");
      }

      setHtmlValue(data.html);
      setCssValue(data.css);
      setJsValue(data.js);

      setLoading(false);
    }

    if (id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const output = `<html>
                    <style>
                    ${debouncedCss}
                    </style>
                    <body>
                    ${debouncedHtml}
                    <script type="text/javascript">
                    ${debouncedJs}
                    </script>
                    </body>
                  </html>`;
    setOutputValue(output);
  }, [debouncedHtml, debouncedCss, debouncedJs]);

  const save = async () => {
    setSaving(true);
    const requestOptions = {
      method: !id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: htmlValue,
        css: cssValue,
        js: jsValue,
        id: id,
      }),
    };
    const response = await fetch(`../api/pens/${id}`, requestOptions);
    const {
      data: { updatedRecord, newRecordId },
    } = await response.json();

    setSaving(false);
    if (!updatedRecord) {
      await router.push(`?id=${newRecordId}`);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <div className={styles.header}>
        <button className={styles.button} onClick={() => (location.href = "/")}>
          New
        </button>
        <button className={styles.button} onClick={save}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <SplitPane
        style={{ marginTop: "60px" }}
        split="horizontal"
        minSize={"50%"}
        onDragFinished={(height) => {
          setHeightValue(`${height - 40}px`);
        }}
      >
        <SplitPane split="vertical" minSize={"33%"}>
          <HtmlEditor
            height={heightValue}
            value={htmlValue}
            onChange={setHtmlValue}
          />
          <SplitPane split="vertical" minSize={"50%"}>
            <CssEditor
              height={heightValue}
              value={cssValue}
              onChange={setCssValue}
            />
            <JavascriptEditor
              height={heightValue}
              value={jsValue}
              onChange={setJsValue}
            />
          </SplitPane>
        </SplitPane>
        <iframe srcDoc={outputValue} className={styles.previewIframe} />
      </SplitPane>
    </>
  );
};

export default Index;
