import classNames from "classnames/bind";
import styles from "./Footer.module.css";

const cx = classNames.bind(styles);

const Footer = () => {
  const startYear: number = 2025;
  const nowYear: number = new Date().getFullYear();

  return (
    <footer className={cx("wrap-footer")}>
      <p className={cx("item-copyright")}>
        © {startYear === nowYear ? `${nowYear} ` : `${startYear}-${nowYear} `}
        duck.log
      </p>
    </footer>
  );
};

export default Footer;
