import styles from "./page.module.css";

export default function Home() {
  const nowYear: number = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>h1 제목입니다</h1>
        <h2>h2 제목입니다</h2>
        <h3>h3 제목입니다</h3>
        <div>
          일단은 이렇게 만들어 보겠습니다..
          <br />
          오늘은 블로그를 만들어야 하거든요.
        </div>
      </main>
      <footer className={styles.footer}>
        ©{nowYear}. beurmuz all rights reserved.
      </footer>
    </div>
  );
}
