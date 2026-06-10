// ==UserScript==
// @name         Unboxd: Letterboxd Extension
// @author       ejmlr
// @version      3.0
// @description  Embeds movies directly into the Letterboxd UI.
// @match        https://letterboxd.com/film/*
// @icon         https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-rgb.svg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL  https://ejmlr.github.io/unboxd/unboxd.user.js
// @updateURL    https://ejmlr.github.io/unboxd/unboxd.user.js
// ==/UserScript==

(function() {
	'use strict';

    const style = document.createElement('style');
      style.textContent = `
        .site-logo .logo,
        h1.sit2e-logo a.logo {
          background-image: url('https://raw.githubusercontent.com/ejmlr/letterboxd/refs/heads/main/unboxd-sprite.svg') !important;
          background-size: contain !important;
          background-repeat: no-repeat !important;
          background-position: left center !important;
        }
      `;
      document.documentElement.appendChild(style);


	const customCSS = `.watch-panel, .js-actions-panel > li:nth-child(6), .backdrop-container, #page-footer {display: none !important}
    .backdrop-container {top: auto;}
    .no-mobile .backdropped .site-header .site-logo::before {background: transparent;}
    .site-body {background-color: transparent;}
    #header {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 100;
        transition: transform 0.3s cubic-bezier(0.05, 0, 0, 1);
        transform: translateY(0);
    }

    body.header-hidden #header {
        transform: translateY(-100%);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.05, 0, 0, 1), opacity 0s 0.3s;
    }
    body.header-static #header {
        position: static;
        top: 50px;
        left: 50px;
    }
    #content {padding-top: 0px;}
    #js-poster-col, .col-17 {margin-top: ${document.querySelector('#header').offsetHeight}px;}
    .video-container {position: relative; width: 100%; height: 100vh; overflow: hidden;}
    .video-container iframe {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        z-index: 0;
    }
    `;
	GM_addStyle(customCSS);

	function getIframe(url) {
		const iframe = document.createElement("iframe");
		iframe.src = url;
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("allowfullscreen", "");
		iframe.setAttribute("allow", "autoplay; picture-in-picture");
		return iframe;
	}

	const tmdbId = document.body.getAttribute('data-tmdb-id');
	const embedUrl = `https://2embed.cc/embed/${tmdbId}`;
	const iframe = getIframe(embedUrl);

	const wrapper = document.createElement("div");
	wrapper.className = "video-container";
	wrapper.appendChild(iframe);

	document.body.insertAdjacentElement("afterbegin", wrapper);

    function onScroll() {
        const y = window.scrollY;
        const viewportHeight = window.innerHeight;
        const headerHeight = document.querySelector('#header').offsetHeight;

        if (y === 0) {
			document.body.classList.add('header-hidden');
		} else {
			document.body.classList.remove('header-hidden');
		}

        const threshold = 0.37;
        const progress = Math.max(y / viewportHeight - threshold, 0);

        const maxBlur = 50;
        const blur = Math.min(progress * maxBlur, maxBlur);

        const minBrightness = 50;
        const brightness = Math.max(100 - (y / viewportHeight) * minBrightness, minBrightness);

        document.querySelector('.video-container iframe').style.filter = `blur(${blur}px) brightness(${brightness}%)`;
	};

    window.scrollTo({ top: window.innerHeight * 0.2, behavior: 'smooth' });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();
