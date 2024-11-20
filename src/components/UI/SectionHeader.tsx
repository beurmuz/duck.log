import classNames from "classnames/bind";
import styles from "./SectionHeader.module.css";

const cx = classNames.bind(styles);

const SectionHeader = ({ sectionName }: { sectionName: string }) => {
  return (
    <nav className={cx("wrap-header")}>
      <h2 className={cx("section-name")}>{sectionName}</h2>
      <button className={cx("category-button")}>
        <img src="/category-icon.png" className={cx("category-icon")} />
      </button>
    </nav>
  );
};

export default SectionHeader;
