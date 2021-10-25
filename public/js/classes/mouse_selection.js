const mouse_selection = class {
	constructor(options) {
        this.scene = options.scene

        this.selection = this.scene.add.rectangle(0, 0, 0, 0, 0x1d7196, 0.5)

        this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this)
        this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this)
        this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this)
    }

    /**
     * @param {Phaser.Input.Pointer} pointer
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver
    */
    handlePointerDown(pointer, currentlyOver)
    {
        let worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        this.selection.x = worldPoint.x
        this.selection.y = worldPoint.y
    }

    positionToCamera (position, t_camera, t_output)
    {
        return t_camera.getWorldPoint(position.x, position.y, t_output);
    }

    /**
     * @param {Phaser.Input.Pointer} pointer
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver
    */
    handlePointerMove(pointer, currentlyOver)
    {
        if (!pointer.isDown)
        {
            return
        }

        let camera = this.scene.cameras.main;
        let worldPoint = pointer.positionToCamera(camera);
        let prevWorldPoint = this.positionToCamera(pointer.prevPosition, camera);

        const dx = worldPoint.x - prevWorldPoint.x
        const dy = worldPoint.y - prevWorldPoint.y

        this.selection.width += dx
        this.selection.height += dy

        // create a new Rectangle
        const selectionRect = new Phaser.Geom.Rectangle(
            this.selection.x,
            this.selection.y,
            this.selection.width,
            this.selection.height
        )

        // check if width or height is negative
        // and then adjust
        if (selectionRect.width < 0)
        {
            selectionRect.x += selectionRect.width
            selectionRect.width *= -1
        }
        if (selectionRect.height < 0)
        {
            selectionRect.y += selectionRect.height
            selectionRect.height *= -1
        }

        // use the new Rectangle to check for overlap
        const selected = this.scene.physics.overlapRect(
            selectionRect.x,
            selectionRect.y,
            selectionRect.width,
            selectionRect.height
        )

        // do something with selected
    }

    /**
     * @param {Phaser.Input.Pointer} pointer
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver
    */
    handlePointerUp(pointer, currentlyOver)
    {
        this.selection.width = 0
        this.selection.height = 0
    }

}