import React from "react";
import classNames from "classnames/bind";
import styles from "./Company.module.css";
import Image from "next/image";

const cx = classNames.bind(styles);

const Company = () => {
  return (
    <div className={cx("career-item")}>
      <span className={cx("career-logo")}>
        <Image
          src="/company.png"
          alt="Company Logo"
          width={40}
          height={40}
          className={cx("logo-image")}
        />
      </span>
      <div className={cx("career-info")}>
        <h3 className={cx("job-title")}>Frontend Engineer</h3>
        <div className={cx("company-meta")}>
          <span className={cx("company-name")}>(? - ing) 제 커리어의 시작점이 되어주세요!</span>
          {/* <span className={cx("company-name")}>회사명,</span>
          <span className={cx("company-term")}>(2026 - 구직중)</span> */}
          {/* <ul className={cx("company-todo-list")}>
            <li className={cx("company-todo")}>제 커리어의 시작점이 되어주세요!</li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default Company;
