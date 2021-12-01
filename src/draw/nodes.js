import { BitmapText, Circle, Graphics, Point, utils } from 'pixi.js'
import { descending } from 'd3'

import { click } from '../interface/click'

const splitInTwo = string => {
    const middle = Math.round(string.length / 2)
    for (let i = middle, j = middle; i < string.length || j >= 0; i++, j--) {
        if (string[i] === ' ') return [string.substring(0, i), string.substring(i + 1)]
        if (string[j] === ' ') return [string.substring(0, j), string.substring(j + 1)]
    }
    return [string, '']
}

export default (entities) => {

    const stage = new Graphics()
    // stage.alpha = 0
    stage.name = 'nodes'
    s.viewport.addChild(stage)

    entities
        .filter(e => e['type'] == 'person' || e['type'] == 'org') // Keep nodes
        .forEach(e => {


            // Circle

            console.log()

            const radiusByWeight = (e['frequency_norm'] * 100)

            const circle = new Graphics()
            circle.beginFill('0x' + e['color'].substring(1), 1)
            // circle.lineStyle(.1, 0x333333, 1);
            circle.drawCircle(0, 0, radiusByWeight)
            circle.endFill()
            circle.position = new Point(e['x'], e['y'])

            stage.addChild(circle)

            
            // Label

            const [nA, nB] = splitInTwo(e['name'])

            const text = new BitmapText(
                `${nA}\n${nB}`,
                {
                    fontName: 'Lato',
                    fontSize: 3,
                    align: 'center',
                    tint: 0x333333
                })

            text.position.set(e['x'] - text.width / 2, e['y'] + radiusByWeight)

            stage.addChild(text)


            // Interactions

            // node.circle.hitArea = new Circle(0, 0, radiusByWeight)
            // node.circle.interactive = true
            // node.circle.buttonMode = true

            // node.circle.click = mouseData => {

            //     // On click

            //     click(node)

            //     //     // Switch off nodes

            //     //     s.nodes.forEach(node => {
            //     //         node.circle.tint = 0xFFFFFF
            //     //         node.text.tint = 0xFFFFFF
            //     //         node.text.fill = 0xcFFFFFF
            //     //     })

            //     //     // Switch on nodes

            //     //     s.nodes.filter(peer => node.peers.includes(peer.id))
            //     //         .forEach(node => {
            //     //             node.circle.tint = color.on
            //     //             node.text.tint = color.on
            //     //         })
            // }


        })

}