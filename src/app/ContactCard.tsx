"use client";

import classNames from "classnames/bind";
import styles from "./Mainpage.module.css";
import React from "react";

const cx = classNames.bind(styles);

export default function ContactCard() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("fallinta2@gmail.com");
    alert("이메일이 복사되었습니다.");
  };

  return (
    <div className={cx("card", "contact", "clickable")} onClick={handleClick}>
      <span className={cx("card-title", "underlined")}>Contact ↗</span>
    </div>
  );
}
