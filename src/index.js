// CSS

import '../node_modules/css-reset-and-normalize/css/reset-and-normalize.min.css'
import './assets/main.css'

// Libraries

import { csv, json, xml, image, extent, scaleLinear } from 'd3'
import { Application, BitmapFont, Texture } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

// Assets

import background from './draw/background'
import clusters from './draw/clusters.js'
import contours from './draw/contours.js'
import contours_negative from './draw/contours_negative.js'
import contours_positive from './draw/contours_positive.js'
import keywords from './draw/keywords.js'
import cluster_contour from './draw/clusters.js'
import nodes from './draw/nodes.js'

import search from './interface/search'

import fontXML from './assets/Lato.fnt'
import fontPNG from './assets/Lato.png'

import backgroundImage from './assets/background.png'

import entities from './data/entities.csv'

// Load

Promise.all([
    csv(entities),
    xml(fontXML),
    image(fontPNG),
    image(backgroundImage),

]).then(([entities, fontXML, fontPNG, backgroundImage]) => {

    window.s = { 'entities': entities } // Set global variable
    console.table(entities[Math.floor(Math.random() * entities.length)]) // Test
    BitmapFont.install(fontXML, Texture.from(fontPNG)) // Font loader


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
        // screenWidth: window.innerWidth,
        // screenHeight: window.innerHeight,
        worldWidth: window.innerWidth,
        worldHeight: window.innerHeight,
        interaction: s.app.renderer.plugins.interaction
    }).drag().pinch().wheel().decelerate()
        .clampZoom({
            minWidth: 50, minHeight: 50,
            maxWidth: window.innerWidth,
            maxHeight: window.innerHeight
        })
        .clamp({ direction: 'all' })

    s.app.stage.addChild(s.viewport)


    // Set dimensions (it seems to work, but it might be improved or completely removed)

    const extX = extent(entities, e => e['x']), extY = extent(entities, e => e['y'])
    const smallerDimension = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight
    const margin = 100

    const scaleX = scaleLinear().domain([extX[0], extX[1]]).range([margin, smallerDimension - margin])
    const scaleY = scaleLinear().domain([extY[0], extY[1]]).range([margin, smallerDimension - margin])

    const marginTop = window.innerWidth > window.innerHeight ? 0 : (window.innerHeight - window.innerWidth) / 2
    const marginLeft = window.innerWidth < window.innerHeight ? 0 : (window.innerWidth - window.innerHeight) / 2

    entities.forEach(e => {
        e['x'] = marginLeft + scaleX(e['x'])
        e['y'] = marginTop + scaleY(e['y'])
    })


    // Transparency on zoom

    const zoomOut = scaleLinear().domain([6, 1]).range([0, 1]) // Visible when zooming out
    const zoomIn = scaleLinear().domain([6, 1]).range([1, 0]) // Visible when zooming in

    s.viewport.on('zoomed', e => {

        let scale

        try {
            scale = e.viewport.lastViewport.scaleX
        } catch {
            scale = 1
        }

        // console.log(scale)

        // e.viewport.children.find(child => child.name == 'contours_positive').alpha = zoomOut(scale)
        // e.viewport.children.find(child => child.name == 'contours_negative').alpha = zoomOut(scale)
        // e.viewport.children.find(child => child.name == 'keywords').alpha = zoomOut(scale)

        // e.viewport.children.find(child => child.name == 'nodes').alpha = zoomIn(scale)
        // e.viewport.children.find(child => child.name == 'clusters').alpha = zoomOut(scale)
    })


    // Rendering

    background(backgroundImage)
    clusters(entities)
    keywords(entities)
    nodes(entities)
    contours(entities)
    // contours_negative(data)
    // contours_positive(data)
    // cluster_contour(data, clusters)
    // search(data)

    s.viewport.fit()
    s.viewport.moveCenter(window.innerWidth / 2, window.innerHeight / 2)



    window.onresize = () => {
        s.viewport.resize()
    } // Prevent pinch gesture in Chrome

    window.addEventListener('wheel', e => {
        e.preventDefault()
    }, { passive: false }) // Prevent wheel interference

})