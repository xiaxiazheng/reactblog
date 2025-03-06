import React from "react";
import styles from "./index.module.scss";
import markdownIt from "markdown-it";
import hljs from 'highlight.js'
import "highlight.js/styles/vs2015.css";

interface PropsType {
    blogcont: string | undefined;
    style?: React.CSSProperties;
}

const MarkdownShow = React.forwardRef<HTMLInputElement, PropsType>((props, ref) => {
    const { blogcont, style } = props;

    const md = markdownIt({
        highlight: function (str: string, lang: string) {
            console.log('hljs.getLanguage(lang)', hljs.getLanguage(lang))
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre><code class="hljs">' +
                        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                        '</code></pre>';
                } catch (__) { }
            }
            return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
        }
    });

    return (
        <div
            className={`${styles.markdownShower}`}
            ref={ref}
            style={style}
            dangerouslySetInnerHTML={{
                __html: md.render(blogcont || ''),
            }}
        />
    );
});

export default MarkdownShow;
