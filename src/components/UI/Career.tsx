"use client";

import classNames from "classnames/bind";
import styles from "./Career.module.css";
import Image from "next/image";

const cx = classNames.bind(styles);

const Career = () => {
    return (
        <div className={cx("wrap-container")}>
            <h2 className={cx("section-title")}>경력</h2>
            <div className={cx("career-list")}>
                <div className={cx("career-item")}>
                    <div className={cx("career-logo")}>
                        <Image
                            src="/company.png"
                            alt="Company Logo"
                            width={48}
                            height={48}
                            className={cx("logo-image")}
                        />
                    </div>
                    <div className={cx("career-info")}>
                        <div className={cx("job-header")}>
                            <h3 className={cx("job-title")}>Frontend Engineer</h3>
                        </div>
                        <div className={cx("company-meta")}>
                            <span className={cx("company-name")}>구직중,</span>
                            <span className={cx("company-term")}>2026 - ing</span>
                            <p className={cx("career-content")}>제 커리어의 시작점이 되어주세요!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Career;
