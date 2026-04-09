import classNames from "classnames/bind";
import styles from "./AboutPage.module.css";
import Introduce from "@/components/UI/Introduce";
import Career from "@/components/UI/Career";

const cx = classNames.bind(styles);

const AboutPage = () => {
  return <section className={cx("wrap-page")}>
    <Introduce />
    <Career />
  </section>;
};

export default AboutPage;
