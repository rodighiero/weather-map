// CSS

import '../node_modules/css-reset-and-normalize/css/reset-and-normalize.min.css'
import './assets/main.css'

// Libraries

import { csv, json, xml, image, extent, scaleLinear } from 'd3'
import { Application, BitmapFont, Texture } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

// Assets

import background from './draw/background'
import contours_islands from './draw/contours_islands.js'
import contours_negative from './draw/contours_negative.js'
import contours_positive from './draw/contours_positive.js'
import keywords_distant from './draw/keywords_distant.js'
import cluster_contour from './draw/cluster_contour.js'
import nodes from './draw/nodes.js'

import search from './interface/search'

import fontXML from './assets/Lato.fnt'
import fontPNG from './assets/Lato.png'

import backgroundImage from './assets/background.png'

import clusters from './data/clusters.csv'
import embedding from './data/embedding.csv'
import frequencies from './data/frequencies.json'
import names from './data/names.csv'
import occurrences from './data/occurrences.csv'
import regressions from './data/regressions.csv'
import urls from './data/urls.json'


// Load

Promise.all([
    csv(embedding),
    csv(names),
    csv(occurrences),
    csv(regressions),
    json(frequencies),
    json(urls),
    csv(clusters),
    xml(fontXML),
    image(fontPNG),
    image(backgroundImage),


]).then(([embedding, names, occurrences, regressions, frequencies, urls, clusters, fontXML, fontPNG, backgroundImage]) => {


    // Set global variable

    window.s = {}


    // Set data

    let data = embedding.reduce((array, value, i) => {
        array.push([Number(value.x), Number(value.y), Number(occurrences[i].occurrence), names[i].name, regressions[i].regression, frequencies[i], urls[i], clusters[i]])
        return array
    }, [])

    // Data Test

    const sample = {}
    const random = Math.floor(Math.random() * data.length)
    sample.x = data[random][0]
    sample.y = data[random][1]
    sample.occurrence = data[random][2]
    sample.name = data[random][3]
    sample.regression = data[random][4]
    sample.frequency = String(data[random][5])
    sample.urls = String(data[random][6])
    sample.clusters = String(data[random][7])

    console.log('Sample element')
    console.table(sample)

    console.log(frequencies)

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



    // Transparency on zoom

    const zoomOut = scaleLinear().domain([6, 1]).range([0, 1]) // Visible when zooming out
    const zoomIn = scaleLinear().domain([6, 1]).range([1, 0]) // Visible when zooming in

    s.viewport.on('zoomed', e => {
        const scale = e.viewport.lastViewport.scaleX
        // e.viewport.children.find(child => child.name == 'contours_positive').alpha = zoomOut(scale)
        // e.viewport.children.find(child => child.name == 'contours_negative').alpha = zoomOut(scale)
        // e.viewport.children.find(child => child.name == 'keywords_distant').alpha = zoomOut(scale)
        
        // e.viewport.children.find(child => child.name == 'nodes').alpha = zoomIn(scale)
        // e.viewport.children.find(child => child.name == 'clusters').alpha = zoomOut(scale)
    })


    // Font loader

    BitmapFont.install(fontXML, Texture.from(fontPNG))


    // Rendering

    background(backgroundImage)
    contours_islands(data)
    nodes(data)
    contours_negative(data)
    contours_positive(data)
    
    keywords_distant(data)

    // cluster_contour(data, clusters)
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