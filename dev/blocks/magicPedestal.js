IDRegistry.genBlockID("magicPedestal");
Block.createBlock("magicPedestal", [{
	name: "Magic Pedestal",
	texture: [
		["obsidian", 0]
	],
	inCreative: true
}], Block.createSpecialType({
	base: 49
}));
mod_tip(BlockID["magicPedestal"]);

Block.registerDropFunction("magicPedestal", function (coords, id, data, diggingLevel, toolLevel) {
	return [];
});

Block.setRandomTickCallback(BlockID.magicPedestal, function (x, y, z, id, data) {
	particles_for_pedestal(x, y, z);
});

function particles_for_pedestal(x, y, z) {
	var bonus_coords = [
		[1 / 16 * 4, 1 / 16 * 4],
		[1 / 16 * 13, 1 / 16 * 4],
		[1 / 16 * 4, 1 / 16 * 13],
		[1 / 16 * 12, 1 / 16 * 12]
	];
	for (var i in bonus_coords) {
		var emitter = new Particles.ParticleEmitter(x + bonus_coords[i][0], y + 1 / 16 * 14, z + bonus_coords[i][1]);
		emitter.setEmitRelatively(true);
		emitter.emit(4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
}

(function () {
	var render = new ICRender.Model();
	BlockRenderer.setStaticICRender(BlockID.magicPedestal, -1, render);

	var boxes = [
		[0, 0, 0, 1, 0.1, 1, BlockID.magicPedestal, 0],
		[0.15, 0.1, 0.15, 0.85, 0.2, 0.85, BlockID.magicPedestal, 0],
		[0.3, 0.2, 0.3, 0.7, 0.7, 0.7, BlockID.magicPedestal, 0],
		//[0.2, 0.7, 0.2, 0.8, 0.75, 0.8],
		[0.2, 0.75, 0.2, 0.25, 0.8, 0.25, 89, 0],
		[0.75, 0.8, 0.25, 0.8, 0.75, 0.2, 89, 0],
		[0.25, 0.8, 0.75, 0.2, 0.75, 0.8, 89, 0],
		[0.75, 0.75, 0.75, 0.8, 0.8, 0.8, 89, 0]
	]

	for (var i in boxes) {
		var box = boxes[i];
		var model = BlockRenderer.createModel();
		model.addBox(box[0], box[1], box[2], box[3], box[4], box[5], box[6], box[7]);
		render.addEntry(model);
	}

	var Dmodel = new ICRender.CollisionShape();
	var entry = Dmodel.addEntry();

	entry.addBox(0, 0, 0, 1, 0.75, 1);

	var model = BlockRenderer.createModel();
	model.addBox(0.2, 0.7, 0.2, 0.8, 0.75, 0.8, [
		["magic_pedestal_top", 0],
		["magic_pedestal_top", 0],
		["magic_pedestal_side", 0],
		["magic_pedestal_side", 0],
		["magic_pedestal_side", 0],
		["magic_pedestal_side", 0]
	]);

	render.addEntry(model);

	BlockRenderer.setCustomCollisionShape(BlockID.magicPedestal, -1, Dmodel);
})()

var config_animation = __config__.getBool("animation");
TileEntity.registerPrototype(BlockID.magicPedestal, {
	defaultValues: {
		anim: null,
		lastid: 0,
		lastdata: 0,
		max_y: false,
		is_item: false
	},
	getTransportSlots: function () {
		return {
			input: ["slot"],
			//output: ["slot"]
		};
	},
	click: function (id, count, data, coords) {
		//Game.prevent();
		if (this.container.getSlot('slot').id == 0) {
			var item = Player.getCarriedItem();
			if (item.id == 0) return;
			this.container.setSlot('slot', item.id, 1, item.data, item.extra);
			Player.decreaseCarriedItem(1);
		} else {
			this.container.dropAt(this.x + 0.5, this.y + 1, this.z + 0.5);
		}
		return true;
	},
	tick: function () {
		//Game.tipMessage('Chunk is loaded');
		var item = this.container.getSlot('slot');
		if ((!this.data.anim || (this.data.lastid != item.id || this.data.lastdata != item.data)) && item.id != 0) {
			if ((this.data.lastid != item.id || this.data.lastdata != item.data) && this.data.anim) this.data.anim.destroy();
			this.data.lastid = item.id;
			this.data.lastdata = item.data;
			var bonus_coords = {
				x: 0,
				y: 0,
				z: 0
			};
			var rotation = [0, 0, 0];
			this.data.is_item = all_items.indexOf(item.id) != -1;
			if (this.data.is_item) {
				bonus_coords.x -= 0.06 - 1 / 16;
				bonus_coords.y -= 0.095 + 1 / 16 / (1 / (1 / (16 / 6))) * 3.5;
				bonus_coords.z += 0.06125 - 1 / 16;
				rotation = [Math.PI / 2, Math.PI, 0];
			}
			this.data.anim_coords = {
				x: this.x + 0.5 + 1 / 16 - 1 / 16 + bonus_coords.x,
				y: this.y + 0.75 + 0.125 + 1 / 16 / (1 / (1 / (16 / 6))) * 3.5 + bonus_coords.y,
				z: this.z + 0.5 - 1 / 16 + 1 / 16 + bonus_coords.z
			}
			this.data.anim = new Animation.Item(this.data.anim_coords.x, this.data.anim_coords.y, this.data.anim_coords.z);
			this.data.describe = {
				id: item.id,
				count: 1,
				data: item.data,
				size: 1 / (16 / 6),
				rotation: rotation,
				notRandomize: true
			}
			this.data.anim.describeItem(this.data.describe);
			this.data.anim.load();
		} else if (this.data.anim && item.id == 0) {
			this.data.lastid = 0;
			this.data.lastdata = 0;
			this.data.anim.destroy();
			this.data.anim = null;
			this.data.max_y = false;
			this.data.is_item = false;
		} else if (this.data.anim && config_animation) {
			this.data.describe.rotation[1] += Math.sin(Math.PI / 180);
			if (this.data.describe.rotation[0] > 0) this.data.describe.rotation[0] -= Math.PI / 180;
			if ((this.data.anim.coords.y <= this.data.anim_coords.y + (this.data.is_item ? 0.152 : 0) && this.data.max_y) || (this.data.anim.coords.y >= this.data.anim_coords.y + 0.3 + (this.data.is_item ? 0.152 : 0) && !this.data.max_y)) this.data.max_y = !this.data.max_y;
			if (!this.data.max_y)
				this.data.anim.setPos(this.data.anim.coords.x, this.data.anim.coords.y + 0.002, this.data.anim.coords.z); 
			else 
				this.data.anim.setPos(this.data.anim.coords.x, this.data.anim.coords.y - 0.002, this.data.anim.coords.z);
			this.data.anim.setItemRotation(this.data.describe.rotation[0], this.data.describe.rotation[1], this.data.describe.rotation[2]);
		}
	},
	init: function () {
	  if (this.data.anim) this.data.anim.load();
	},
	destroyBlock: function (coords, player) {
		if (this.data.anim) {
			this.data.anim.destroy();
			this.data.anim = null;
		}
	}
})