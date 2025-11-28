"use client";

import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import styles from "./BackToLink.module.css";

const cx = classNames.bind(styles);

const BackToLink = () => {
  const router = useRouter(); // 브라우저의 히스토리 API를 이용
  const handleBack = () => {
    router.back();
  };

  return (
    <div className={cx("wrap-back-to-link")}>
      <button className={cx("button-back")} onClick={handleBack}>
        ← Back
      </button>
    </div>
  );
};

export default BackToLink;
