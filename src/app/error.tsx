"use client";

import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ErrorPage.module.css";

const cx = classNames.bind(styles);

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 리포팅 서비스에 로깅할 수 있습니다
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className={cx("wrap-page")}>
      <div className={cx("card")}>
        <h2 className={cx("title")}>앗, 문제가 발생했어요!</h2>
        <p className={cx("message")}>
          일시적인 서버 오류이거나 데이터를 불러오지 못했습니다.<br />
          잠시 후 다시 시도해주세요.
        </p>
        <button
          className={cx("button")}
          onClick={() => reset()}
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
