import styles from "./page.module.css";

export default function Home() {
  const nowYear: number = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>🔧 블로그 개발중 🔧</p>
      </main>
      <footer className={styles.footer}>
        ©{nowYear}. beurmuz all rights reserved.
      </footer>
    </div>
  );
}
