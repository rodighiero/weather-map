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

            const center_1 = polygonCentroid(p1)
            const center_2 = polygonCentroid(p2)

            let overlapping = false

            coo2.forEach(point => {
                if (polygonContains(p1, point))
                    overlapping = true
            })

            if (overlapping) {

                const circle_1 = new Graphics()
                circle_1.beginFill('0x000000', 1)
                circle_1.drawCircle(0, 0, 5)
                circle_1.endFill()
                circle_1.position = new Point(center_1[0], center_1[1])
                stage.addChild(circle_1)

                const circle_2 = new Graphics()
                circle_2.beginFill('0x000000', 1)
                circle_2.drawCircle(0, 0, 5)
                circle_2.endFill()
                circle_2.position = new Point(center_2[0], center_2[1])
                stage.addChild(circle_2)
            }

        })
    })


    //     const polygon = polygonHull(coordinates)
    //     stage.lineStyle(.2, 0xFFFFFF)
    //     stage.beginFill(0xFFFFFF, .5)
    //     polygon.forEach((p, i) => (i == 0) ? stage.moveTo(p[0], p[1]) : stage.lineTo(p[0], p[1]))
    //     stage.closePath()
    //     const center = polygonCentroid(polygon)


}