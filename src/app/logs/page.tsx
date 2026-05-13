import styles from "./Logs.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const PDF_URL = process.env.BLOB_PDF_URL;

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
