import { Graphics, Loader, Point, Sprite, Container } from 'pixi.js'
import { extent, polygonHull, polygonCentroid, polygonContains, group, mean } from 'd3'

export default entities => {


    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'fronts'
    s.viewport.addChild(stage)

    let clusters = group(entities, e => e['cluster'])

    clusters.forEach((c1, i1) => {
        clusters.forEach((c2, i2) => {
            if ((i1 >= i2) || (i1 == -1) || (i2 == -1))
                return

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

                let m1 = mean(c1.map(d => d.slope))
                let m2 = mean(c2.map(d => d.slope))

                // const circle_1 = new Graphics()
                // circle_1.beginFill((m1 > 0) ? '0xFF0000' : '0x0000FF', 1)
                // circle_1.drawCircle(0, 0, 5)
                // circle_1.endFill()
                // circle_1.position = new Point(center_1[0], center_1[1])
                // stage.addChild(circle_1)

                // const circle_2 = new Graphics()
                // circle_2.beginFill((m2 > 0) ? '0xFF0000' : '0x0000FF', 1)
                // circle_2.drawCircle(0, 0, 5)
                // circle_2.endFill()
                // circle_2.position = new Point(center_2[0], center_2[1])
                // stage.addChild(circle_2)

                const container = new Container()
                stage.addChild(container)
                container.x = (center_1[0] + center_2[0]) / 2
                container.y = (center_1[1] + center_2[1]) / 2

                // const circle_3 = new Graphics()
                // circle_3.beginFill('0xFF0000', 1)
                // circle_3.drawCircle(0, 0, 3)
                // circle_3.endFill()
                // container.addChild(circle_3)

                const width = center_2[0] - center_1[0]
                const heigth = center_2[1] - center_1[1]

                
                const m = 1
                const n = .5
                const a = [+ heigth - width * n, -width - heigth * n]
                const b = [- heigth - width * n, width - heigth * n]
                const c = [+ heigth * m + width, -width * m + heigth]
                const d = [- heigth * m + width, width * m + heigth]

                // const line = new Graphics()
                // line.lineStyle(2, 0x000000)
                // line.moveTo(a[0], a[1])
                // line.lineTo(b[0], b[1])
                // container.addChild(line)


                // Double back line
                // const line2 = new Graphics()
                // line2.lineStyle(2, 0x000000)
                // line2.moveTo(c[0], c[1])
                // line2.lineTo(d[0], d[1])
                // container.addChild(line2)

                const bezier = new Graphics()
                bezier.lineStyle(3, 0x999999)
                bezier.moveTo(c[0], c[1]);
                bezier.bezierCurveTo(a[0], a[1], b[0], b[1], d[0], d[1])
                container.addChild(bezier)

            }

        })
    })


}