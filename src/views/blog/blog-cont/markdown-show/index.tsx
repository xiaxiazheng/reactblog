import React from "react";
import styles from "./index.module.scss";
import markdownIt from "markdown-it";
import hljs from 'highlight.js'
import "highlight.js/styles/vs2015.css";

interface PropsType {
    blogcont: string | undefined;
    style?: React.CSSProperties;
    keyword?: string; // 用于高亮的关键字
}

const MarkdownShow = React.forwardRef<HTMLInputElement, PropsType>((props, ref) => {
    const { blogcont, style, keyword } = props;
    
    function keywordHighlightPlugin(md: any, options: any) {
        const { keyword } = options;
        const originalTextRenderer = md.renderer.rules.text; // 原本的默认处理也只是 escapeHtml 而已

        md.renderer.rules.text = (tokens: any, idx: any, options: any, env: any, self: any) => {
            const text = originalTextRenderer(tokens, idx, options, env, self);
            if (keyword) {
                // 使用正则表达式替换关键词
                return text.replace(new RegExp(keyword, 'gi'), (match: any) => {
                    return '<span class="keyword">' + match + '</span>';
                });
            }
            return text;
        };
    }

    const md = markdownIt({
        highlight: function (str: string, lang: string) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre><code class="hljs">' +
                        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                        '</code></pre>';
                } catch (__) { }
            }
            return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
        }
    }).use(keywordHighlightPlugin, {
        keyword
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
