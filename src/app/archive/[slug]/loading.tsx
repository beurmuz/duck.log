import classNames from "classnames/bind";
import styles from "./ArchiveDetail.module.css";

const cx = classNames.bind(styles);

export default function Loading() {
  return (
    <section className={cx("wrap-page")}>
      <header className={cx("wrap-header")} style={{ opacity: 0.6 }}>
        <div 
          style={{ 
            width: "3rem", 
            height: "3rem", 
            backgroundColor: "#eee", 
            borderRadius: "50%",
            marginBottom: "1rem"
          }} 
        />
        <div 
          style={{ 
            width: "70%", 
            height: "2rem", 
            backgroundColor: "#eee", 
            borderRadius: "0.5rem",
            marginBottom: "1.5rem"
          }} 
        />
        <div className={cx("post-meta")}>
          <div 
            style={{ 
              width: "5rem", 
              height: "1rem", 
              backgroundColor: "#eee", 
              borderRadius: "0.25rem" 
            }} 
          />
        </div>
      </header>

      <section className={cx("wrap-notioncontent")} style={{ marginTop: "2rem" }}>
        {[85, 70, 95, 60, 80].map((width, i) => (
          <div 
            key={i}
            style={{ 
              width: `${width}%`, 
              height: "1rem", 
              backgroundColor: "#f5f5f5", 
              borderRadius: "0.25rem",
              marginBottom: "1rem"
            }} 
          />
        ))}
      </section>
    </section>
  );
}
