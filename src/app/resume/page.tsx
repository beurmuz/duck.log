import classNames from "classnames/bind";
import styles from "./ResumePage.module.css";

const cx = classNames.bind(styles);

const ResumePage = () => {
  return (
    <section className={cx("wrap-page")}>
      <div className={cx("header")}>
        <h1 className={cx("name")}>장서령</h1>
        <p className={cx("title")}>Software Engineer (Frontend)</p>
        <div className={cx("contact")}>
          <span>Email: fallinta2@gmail.com</span>
          <span>•</span>
          <a
            href="https://github.com/beurmuz"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub: github.com/beurmuz
          </a>
          <span>•</span>
          <a
            href="https://duck-log.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog: duck-log.vercel.app
          </a>
        </div>
      </div>

      <div className={cx("section")}>
        <h2 className={cx("section-title")}>Summary</h2>
        <p className={cx("summary-text")}>
          구조적으로 해결해 효율을 높이는 Frontend Engineer. 복잡한 문제를
          구조화해 흐름과 렌더링, 데이터 처리를 효율적으로 재정비하며 성능과
          안정성을 개선해 왔습니다.
        </p>
        <p className={cx("summary-text")}>
          단위 테스트와 CI/CD로 데이터 무결성을 검증했고, 데이터 기반 분석으로
          UX·SEO·성능 지표를 높였습니다. 협업 효율을 위해 Mock 환경 등을 구축한
          경험이 있습니다.
        </p>
      </div>

      <div className={cx("section")}>
        <h2 className={cx("section-title")}>Projects</h2>

        <div className={cx("project")}>
          <div className={cx("project-header")}>
            <h3 className={cx("project-title")}>duck.log</h3>
            <span className={cx("project-period")}>2025.11 - ing</span>
          </div>
          <p className={cx("project-description")}>
            Notion API 활용 블로그 자동 변환 서비스. Next.js, TypeScript, Vitest
            등 사용.
          </p>
          <ul className={cx("project-achievements")}>
            <li>
              <strong>성능 최적화:</strong> SSG/ISR 도입으로 TTFB 약 90% 개선
              (7.33s → 0.75s).
            </li>
            <li>
              <strong>안정성:</strong> 비정형 데이터 도메인 모델링 및 57개 단위
              테스트 작성.
            </li>
            <li>
              <strong>구조:</strong> BFS 기반 큐 구조로 스택 오버플로우 해결.
            </li>
          </ul>
        </div>

        <div className={cx("project")}>
          <div className={cx("project-header")}>
            <h3 className={cx("project-title")}>SIK-K</h3>
            <span className={cx("project-period")}>2023.08 - ing</span>
          </div>
          <p className={cx("project-description")}>
            아티스트 정보 수집 웹 서비스. React, Python, GitHub Actions 등 사용.
          </p>
          <ul className={cx("project-achievements")}>
            <li>
              <strong>UX 개선:</strong> GA 분석 기반 UI 재구성, Chart.js 데이터
              시각화.
            </li>
            <li>
              <strong>자동화:</strong> GitHub Actions 크롤링 및 fallback 구조
              설계.
            </li>
            <li>
              <strong>최적화:</strong> WebP, Code Splitting 적용. LCP 70% 감소,
              성능 점수 58% 개선. SEO 유입률 0% → 20% 증가.
            </li>
          </ul>
        </div>

        <div className={cx("project")}>
          <div className={cx("project-header")}>
            <h3 className={cx("project-title")}>Colrapy</h3>
            <span className={cx("project-period")}>2022.04 - 10</span>
          </div>
          <p className={cx("project-description")}>
            AI 감정 분석 맞춤형 컬러테라피. 팀장 & UI/UX 설계 & FE 개발.
          </p>
          <ul className={cx("project-achievements")}>
            <li>
              <strong>협업:</strong> Issue-Commit 기반 구조 구축, Agile 도입으로
              기한 내 완수.
            </li>
            <li>
              <strong>개발 환경:</strong> Mock + Postman 시뮬레이션으로 독립
              개발 환경 구축. API 호출 75% 감소.
            </li>
            <li>
              <strong>기술 탐구:</strong> jQuery 레거시 분석 및 ES6/TS 모던화로
              Flood Fill 알고리즘 구현.
            </li>
          </ul>
        </div>
      </div>

      <div className={cx("section")}>
        <h2 className={cx("section-title")}>Experience</h2>
        <ul className={cx("experience-list")}>
          <li>
            <strong>Study Mate</strong> (2022.01 - ing): 인증 기반 스터디 운영.
          </li>
          <li>
            <strong>삼성꿈장학재단 희망 튜터링</strong> (2021.03 - 2023.03):
            자료구조, 알고리즘, React 등 지도.
          </li>
          <li>
            <strong>CS 스터디</strong> (2022.09 - 11): DB 파트 요약 및 발표.
          </li>
          <li>
            <strong>Stopwar</strong> (2022.03 - 04): 비영리 웹 개발, 반응형 UI
            및 SEO 개선.
          </li>
          <li>
            <strong>스뮤스뮤 웹 스터디</strong> (2021.05 - 2022.04): Git 협업 및
            DB 설계 실습.
          </li>
        </ul>
      </div>

      <div className={cx("section")}>
        <h2 className={cx("section-title")}>Skills & Education</h2>
        <div className={cx("skills-education")}>
          <div>
            <h3 className={cx("subsection-title")}>Tech Stack</h3>
            <p>
              HTML/CSS, JS/TS, React, Next.js, Zustand, Tailwind, Git, Python,
              GA, Figma, Tableau 등
            </p>
          </div>
          <div>
            <h3 className={cx("subsection-title")}>Certificate</h3>
            <ul className={cx("cert-list")}>
              <li>PCSQL (2024)</li>
              <li>정보처리기사 (2022)</li>
              <li>IoT 지식능력검정 (2018)</li>
            </ul>
          </div>
          <div>
            <h3 className={cx("subsection-title")}>Education</h3>
            <p>상명대학교 휴먼지능정보공학 졸업 (2018-2023)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumePage;
