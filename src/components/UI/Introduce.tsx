"use client";

import classNames from "classnames/bind";
import styles from './Introduce.module.css';

const cx = classNames.bind(styles);

const Introduce = () => {
    return (
        <div className={cx("wrap-container")}>
            <h1 className={cx("introduce-name")}>장서령</h1>
            <span className={cx("introduce-aboutme")}>구조적으로 해결해, 효율을 높이는 Frontend Engineer 입니다.</span>
        </div>
    )
}

export default Introduce;