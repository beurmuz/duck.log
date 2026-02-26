import classNames from "classnames/bind";
import styles from "./ShortsPage.module.css";

const cx = classNames.bind(styles);

const ShortsPage = () => {
  return (
    <section className={cx("wrap-page")}>
      <h1>짧은 지식을 기록하는 공간. </h1>
    </section>
  );
};

export default ShortsPage;
