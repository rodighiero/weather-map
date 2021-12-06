import { Graphics, Loader, Point, Sprite } from 'pixi.js'
import { extent, polygonHull, polygonCentroid, polygonContains, group } from 'd3'

export default entities => {


    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'frictions'
    s.viewport.addChild(stage)

    let clusters = group(entities, e => e['cluster'])

    clusters.forEach((c1, i1) => {
        clusters.forEach((c2, i2) => {
            if ((i1 >= i2) || (i1 == -1) || (i2 == -1))
                return
            // console.log(i1, i2)

            const coo1 = c1.map(e => [e.x, e.y])
            const coo2 = c2.map(e => [e.x, e.y])

            const p1 = polygonHull(coo1)
            const p2 = polygonHull(coo2)

            let overlapping = false

            coo2.forEach(point => {
                // console.log(c1)
                if (polygonContains(p1, point))
                    overlapping = true
            })

            console.log(overlapping)

        })
    })


    //     const polygon = polygonHull(coordinates)
    //     stage.lineStyle(.2, 0xFFFFFF)
    //     stage.beginFill(0xFFFFFF, .5)
    //     polygon.forEach((p, i) => (i == 0) ? stage.moveTo(p[0], p[1]) : stage.lineTo(p[0], p[1]))
    //     stage.closePath()
    //     const center = polygonCentroid(polygon)


}