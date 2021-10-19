// CSS

import '../node_modules/css-reset-and-normalize/css/reset-and-normalize.min.css'
import './assets/main.css'

// Libraries

import { csv, json, xml, image, extent, scaleLinear } from 'd3'
import { Application, BitmapFont, Texture } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

// Assets

import background from './draw/background'
import drawClusters from './draw/clusters.js'
import contours from './draw/contours.js'
import keywords_close from './draw/keywords_close.js'
import keywords_distant from './draw/keywords_distant.js'
import nodes from './draw/nodes.js'

import search from './interface/search'

import fontXML from './assets/Lato.fnt'
import fontPNG from './assets/Lato.png'

import backgroundImage from './assets/background.png'

import names from './data/names.csv'
import clusters from './data/clusters.json'
import embedding from './data/embedding.csv'
import weights from './data/weights.csv'
import pairs from './data/pairs.json'

// Global variables

window.s = {
    // distance: 30,
    // nodes,
    // tokens: []
}

// Start

Promise.all([
    csv(embedding),
    csv(names),
    csv(weights),
    json(pairs),
    json(clusters),
    xml(fontXML),
    image(fontPNG),
    image(backgroundImage),


]).then(([embedding, names, weights, pairs, clusters, fontXML, fontPNG, backgroundImage]) => {


    // Set data

    
    console.log(names[0])
    
    let data = embedding.reduce((array, value, i) => {
        // array[i] = [...embedding[i], lemmas[i].length, authors[i]]
        array.push([Number(value.x), Number(value.y), Number(weights[i].weight), names[i].name])
        return array
    }, [])
    
    console.log(data[1])

    // Set app

    s.app = new Application({
        antialias: true,
        resolution: 2,
        autoDensity: true,
        autoResize: true,
        resizeTo: window
    })

    document.body.prepend(s.app.view)


    // Set viewport

    s.viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        interaction: s.app.renderer.plugins.interaction
    }).drag().pinch().wheel().decelerate()
        .clampZoom({
            minWidth: 50, minHeight: 50,
            maxWidth: window.innerWidth,
            maxHeight: window.innerHeight
        })
        .clamp({ direction: 'all' })

    s.app.stage.addChild(s.viewport)


    // Set dimensions

    const extX = extent(data, d => d[0]), extY = extent(data, d => d[1])

    const shorterDimension = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth

    const margin = 100

    const scaleX = scaleLinear().domain([extX[0], extX[1]]).range([margin, shorterDimension - margin])
    const scaleY = scaleLinear().domain([extY[0], extY[1]]).range([margin, shorterDimension - margin])

    const marginTop = window.innerWidth > window.innerHeight ? 0 : (window.innerHeight - window.innerWidth) / 2
    const marginLeft = window.innerWidth < window.innerHeight ? 0 : (window.innerWidth - window.innerHeight) / 2

    data.forEach(d => { d[0] = marginLeft + scaleX(d[0]); d[1] = marginTop + scaleY(d[1]) })
    pairs.forEach(p => { p[0] = marginLeft + scaleX(p[0]); p[1] = marginTop + scaleY(p[1]) })



    // Transparency on zoom

    const zoomOut = scaleLinear().domain([6, 1]).range([0, 1]) // Visible when zooming out
    const zoomIn = scaleLinear().domain([6, 1]).range([1, 0]) // Visible when zooming in

    s.viewport.on('zoomed', e => {
        const scale = e.viewport.lastViewport.scaleX
        e.viewport.children.find(child => child.name == 'contours').alpha = zoomOut(scale)
        e.viewport.children.find(child => child.name == 'nodes').alpha = zoomIn(scale)
        e.viewport.children.find(child => child.name == 'keywords_distant').alpha = zoomOut(scale)
        // e.viewport.children.find(child => child.name == 'keywords_close').alpha = zoomIn(scale)
        // e.viewport.children.find(child => child.name == 'clusters').alpha = zoomOut(scale)
    })


    // Font loader

    BitmapFont.install(fontXML, Texture.from(fontPNG))


    // Rendering

    background(backgroundImage)
    
    
    
    
    
    contours(data) // We miss value for elevation (which is the occurrencies)









    nodes(data)
    // keywords_close(pairs)
    keywords_distant(data)
    // drawClusters(data, clusters)
    // search(data)

    s.viewport.fit()
    s.viewport.moveCenter(window.innerWidth / 2, window.innerHeight / 2)

    // Prevent pinch gesture in Chrome

    window.onresize = () => {
        s.viewport.resize()
    }

    // Prevent wheel interference

    window.addEventListener('wheel', e => {
        e.preventDefault()
    }, { passive: false })

})