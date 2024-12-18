import classNames from "classnames/bind";
import styles from "./Footer.module.css";

const cx = classNames.bind(styles);

const Footer = () => {
  const startYear: number = 2024;
  const nowYear: number = new Date().getFullYear();

  return (
    <footer className={cx("wrap-footer")}>
      {/* <p className={cx("item-github")}>
        <a href="https://github.com/beurmuz" target="_blank">
          Link to Github →
        </a>
      </p> */}
      <p className={cx("item-copyright")}>
        © {startYear === nowYear ? `${nowYear} ` : `${startYear}-${nowYear} `}
        beurmuz. all rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
