import classNames from "classnames/bind";
import styles from "./page.module.css";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
// import styles from "./page.module.css";

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={cx("wrap-div")}>
      <Header />
      <Footer />
    </div>
  );
}
