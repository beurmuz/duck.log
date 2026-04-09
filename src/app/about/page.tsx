"use client";

import classNames from "classnames/bind";
import styles from "./AboutPage.module.css";
import SectionTitle from "@/components/UI/SectionTitle";
import Company from "@/components/UI/Company";

const cx = classNames.bind(styles);

const AboutPage = () => {
  return (
    <section className={cx("wrap-page")}>
      {/* 소개 */}
      <article className={cx("introduce-section")}>
        <p className={cx("introduce-name")}>장서령
          <span className={cx("introduce-job")}>Frontend Engineer</span>
        </p>
        <section className={cx("introduce-aboutme")}>
          <p>구조적으로 해결해 효율을 높입니다. </p>
          <p>확장 가능한 설계를 통해 유지보수하기 쉬운 개발 환경을 만들고, 생산성을 높이는 것을 좋아합니다.</p>
        </section>
        <p className={cx("introduce-contact")}>
          <a href="https://github.com/beurmuz" target="_blank" rel="noopener noreferrer" className={cx("contact-github")}>
            Github↗︎
          </a>
          <span className={cx("contact-email")} onClick={() => {
            navigator.clipboard.writeText("fallinta2@gmail.com");
            alert("이메일이 복사되었습니다.");
          }}>Email↗︎</span>
        </p>
      </article>

      {/* 경력 */}
      <article className={cx("career-section")}>
        <SectionTitle title="CAREER" />
        <ul className={cx("career-list")}>
          {/* 첫번째 회사 */}
          <Company />
        </ul>
      </article>

      {/* 프로젝트 */}
      {/* <article className={cx("project-section")}>
        <SectionTitle title="PROJECT" />
        <ul className={cx("project-list")}>
          <li className={cx("project-item")}>
            duck.log
          </li>
          <li className={cx("project-item")}>
            SIK-K
          </li>
          <li className={cx("project-item")}>
            Fill In the Blank
          </li>
          <li className={cx("project-item")}>
            Colrapy
          </li>
        </ul>
      </article> */}

    </section >
  );
};

export default AboutPage;
