import styles from "./Logs.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const PDF_URL = "https://qqxuenvm3khc9k51.public.blob.vercel-storage.com/%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%89%E1%85%A5%E1%84%85%E1%85%A7%E1%86%BC_%E1%84%91%E1%85%A9%E1%84%90%E1%85%B3%E1%84%91%E1%85%A9%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A9.pdf";

const LogsPage = () => {
    return (
        <section className={cx("wrap-page")}>
            <div className={cx("buttonWrapper")}>
                <h1 className={cx("title")}>포트폴리오</h1>
                <a
                    href={PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx("externalLink")}
                >
                    새 창에서 크게 보기 ↗
                </a>
            </div>
        </section>
    );
};

export default LogsPage;