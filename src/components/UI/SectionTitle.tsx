import classNames from "classnames/bind";
import styles from './SectionTitle.module.css';

const cx = classNames.bind(styles);

const SectionTitle = ({ title }: { title: string }) => {
    return (
        <h2 className={cx("section-title")}>{title}</h2>
    );
}

export default SectionTitle;