import classNames from "classnames/bind";
import styles from "./SectionHeader.module.css";
import Image from "next/image";

const cx = classNames.bind(styles);

const SectionHeader = ({ sectionName }: { sectionName: string }) => {
  return (
    <nav className={cx("wrap-header")}>
      <h2 className={cx("section-name")}>{sectionName}</h2>
      <button className={cx("category-button")}>
        <Image
          src="/category-icon.png"
          className={cx("category-icon")}
          alt="카테고리 선택 icon"
        />
      </button>
    </nav>
  );
};

export default SectionHeader;
