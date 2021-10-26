import React, {useState} from 'react';
import s from '../../styles/Main.module.css'
import img from '../../../../static/img/Main/main.svg'
import search_icon from '../../../../static/img/Main/search_icon.png'
import MainSlider from "./MainSlider/MainSlider";
import right_arrow from '../../../../static/img/Main/right-arrow.png'
import {Link} from "react-router-dom";
import authStore from "../../../../store/authStore";

const Main = () => {
    let [searchQuery, setSearchQuery] = useState('')

    return (
        <div className={s.container}>
            <div className={s.content_container}>
                <div className={s.left_side}>
                    <h1 className={s.title}>Чему бы вы хотели <span className={s.yellow_text}>научиться</span> сегодня?
                    </h1>
                    <div className={s.input_container}>
                        <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} type="text"
                               className={s.input} placeholder={'Тема консультации'}/>
                        <img className={s.search_icon} src={search_icon} alt=""/>
                    </div>
                    <MainSlider
                        items={['IT и технологии', 'Финансы и расчеты', 'Юриспруденция', 'IT и технологии', 'IT и технологии', 'Финансы и расчеты', 'Юриспруденция', 'IT и технологии']}/>
                </div>
                <img className={s.main_img} src={img} alt=""/>
            </div>
            <div className={s.lower_display}>
                <Link to={'/'}>
                    <div className={`${s.yellow_text} ${s.full_catalog}`}>Полный каталог <img src={right_arrow}
                                                                                              className={s.right_arrow}
                                                                                              alt=""/></div>
                </Link>
                <Link to={'/mentor_registration'}>
                    {!authStore.mentor && <div className={s.to_mentor_btn}>Я хочу зарабывать на своих знаниях</div>}
                </Link>
            </div>

        </div>
    );
};

export default Main;