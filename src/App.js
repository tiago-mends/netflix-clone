/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import './App.css';
import loading from './components/Preloader/loading.gif';

import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {
    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState([]);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            // Lista Total
            let list = await Tmdb.getHomeList();
            setMovieList(list);
            // Lista dos Destaques
            let originals = list.filter(i => i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }
        loadAll();
    }, []);

    useEffect(() => {
        const scrollListener = () => {
           if(window.scrollY > 10){
               setBlackHeader(true);
           } else{
               setBlackHeader(false);
           }
        }
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener)
        }
    },[])

    return (
        <div className="page">
            <Header black={blackHeader}/>

            {featuredData &&
                <FeaturedMovie item={featuredData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items}/>
                ))}
            </section>

            <footer>
                Feito com <span role="img" aria-label="coração">❤️</span> por <a href="https://github.com/tiago-mends" target="_blank">Tiago Mendes</a>
                <div className="footer--c">
                    Direitos de imagem para <a href="https://netflix.com/">Netflix</a><br/>
                    API por <a href="https://www.themoviedb.org/">The MovieDB</a>
                </div>
            </footer>

            {movieList.length <= 0 &&
                <div className="loading">
                    <img src={loading} alt="Carregando..." />
                </div>
            }
        </div>
    );
}
