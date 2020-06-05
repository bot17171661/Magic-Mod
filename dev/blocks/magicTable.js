IDRegistry.genBlockID("magicTable");
Block.createBlock("magicTable", [{
	name: "Magic Table",
	texture: [
		["magic_table_bottom", 0],
		["magic_table_top", 0],
		["magic_table_side", 0]
	],
	inCreative: true
}], Block.createSpecialType({
	base: 49
}));
mod_tip(BlockID["magicTable"]);

IDRegistry.genItemID("magicTable_item");
Item.createItem("magicTable_item", "Magic Table", {
	name: "magic_table_item"
}, {
	stack: 64
});
mod_tip(ItemID["magicTable_item"]);

Item.registerUseFunction("magicTable_item", function (coords, item, block) {
	World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.magicTable, 0);
	Player.decreaseCarriedItem(1);
})

Block.registerDropFunction("magicTable", function (coords, id, data, diggingLevel, toolLevel) {
	return [
		[ItemID.magicTable_item, 1, 0]
	];
});

(function () {
	var render = new ICRender.Model();
	BlockRenderer.setStaticICRender(BlockID.magicTable, -1, render);

	var boxes = [
		[0, 0, 0, 1, 0.75, 1]
	]

	for (var i in boxes) {
		var box = boxes[i];
		var model = BlockRenderer.createModel();
		model.addBox(box[0], box[1], box[2], box[3], box[4], box[5], BlockID.magicTable, 0);
		render.addEntry(model);
	}

	var Dmodel = new ICRender.CollisionShape();
	var entry = Dmodel.addEntry();

	entry.addBox(0, 0, 0, 1, 0.75, 1);

	BlockRenderer.setCustomCollisionShape(BlockID.magicTable, -1, Dmodel);
})()

var particle_table = Particles.registerParticleType({
	texture: "magicTableParticle",
	size: [0.5, 1],
	lifetime: [40, 40],
	render: 2
});

const Crafts = [];

const onCraftStart = {};

const onCraftEnd = {}

const MagicTable = {
	/*
		items = [[id, data],[id, data],[id, data]...];
		targetItem = [id, data];
		result = [id, data];
		recipeviewer_order = [1,2,3...]
		
		recipeviewer_order length must be equal 16
		
		if one of value's of recipeviewer_order equal -1 that is empty slot
		
		recipeviewer_order - order of indexes of items used for recipe viewer
	*/
	addCraft: function (items, targetItem, result, recipeviewer_order) {
		if (!items) return Logger.Log("items not listed", "MagicModAPI ERROR");
		if (!targetItem) return Logger.Log("targetItem not listed", "MagicModAPI ERROR");
		if (!result) return Logger.Log("result not listed", "MagicModAPI ERROR");
		if (recipeviewer_order && recipeviewer_order.length != 16) recipeviewer_order = null;
		Crafts.push({
			items: items,
			centre: targetItem,
			result: result,
			rv: recipeviewer_order
		});
	},
	/*
		item = [id, data];
	*/
	removeCraft: function (item) {
		if (!item) return Logger.Log("item not listed", "MagicModAPI ERROR");
		Crafts.splice(Crafts.find(function (element, index, array) {
			if (element.result[0] == item[0] && element.result[1] == item[1]) return index;
		}), 1)
	},
	/*
		item = [id, data];
	*/
	getCraft: function (item) {
		if (!item) return Logger.Log("item not listed", "MagicModAPI ERROR");
		return Crafts.find(function (element, index, array) {
			if (element.result[0] == item[0] && (element.result[1] == item[1] || item[1] == -1)) return element;
		})
	},
	/*
		item = [id, data];
	*/
	getCrafts: function (item) {
		if (!item) return Logger.Log("item not listed", "MagicModAPI ERROR");
		var listCrafts = [];
		Crafts.find(function (element, index, array) {
			if (element.result[0] == item[0] && (element.result[1] == item[1] || item[1] == -1)) listCrafts.push(element);
		})
		return listCrafts;
	},
	/*
		item = [id, data];
		func = function(coords){};
		
		If func returns 'stop', then craft stops
	*/
	onCraftStart: function (item, func) {
		if (!item) return Logger.Log("item not listed", "MagicModAPI ERROR");
		if (!func) return Logger.Log("func not listed", "MagicModAPI ERROR");
		onCraftStart[item.toString()] = func;
	},
	/*
		item = [id, data];
		func = function(coords){};
	*/
	onCraftEnd: function (item, func) {
		if (!item) return Logger.Log("item not listed", "MagicModAPI ERROR");
		if (!func) return Logger.Log("func not listed", "MagicModAPI ERROR");
		onCraftEnd[item.toString()] = func;
	}
}

TileEntity.registerPrototype(BlockID.magicTable, {
	defaultValues: {
		anim: null,
		rotation: [0, 0, 0],
		coords: null,
		step: null,
		lastid: 0,
		lastdata: 0
	},
	getTransportSlots: function () {
		return {
			input: ["slot"],
			//output: ["slot"]
		};
	},
	created: function () {
		this.data.coords = [
			[this.x + 3, this.z],
			[this.x + 3, this.z + 1],
			[this.x + 2, this.z + 2],
			[this.x + 1, this.z + 3],
			[this.x, this.z + 3],
			[this.x - 1, this.z + 3],
			[this.x - 2, this.z + 2],
			[this.x - 3, this.z + 1],
			[this.x - 3, this.z],
			[this.x - 3, this.z - 1],
			[this.x - 2, this.z - 2],
			[this.x - 1, this.z - 3],
			[this.x, this.z - 3],
			[this.x + 1, this.z - 3],
			[this.x + 2, this.z - 2],
			[this.x + 3, this.z - 1]
		]
	},
	click: function (id, count, data, coords) {
		if (this.data.step) return true;
		var pedestals = [];
		if (id == ItemID.magicWand && Entity.getSneaking(Player.get())) {
			for (var i in this.data.coords) {
				if (World.getBlock(this.data.coords[i][0], this.y, this.data.coords[i][1]).id == 49) {
					World.setBlock(this.data.coords[i][0], this.y, this.data.coords[i][1], BlockID.magicPedestal, 0);
					World.addTileEntity(this.data.coords[i][0], this.y, this.data.coords[i][1]);
					Entity.spawn(this.data.coords[i][0], this.y + 1, this.data.coords[i][1], 93);
				};
			}
			for (var i in this.data.coords) {
				if (World.getBlock(this.data.coords[i][0], this.y, this.data.coords[i][1]).id == BlockID.magicPedestal) {
					var tile = World.getTileEntity(this.data.coords[i][0], this.y, this.data.coords[i][1]);
					if (!tile) tile = World.addTileEntity(this.data.coords[i][0], this.y, this.data.coords[i][1]);
					if (tile && tile.container.getSlot('slot').id != 0) pedestals.push(this.data.coords[i]);
				}
			}
			if (this.container.getSlot('slot').id == 0 || pedestals.length == 0) return;
			var CraftingItems = {};
			for (var i in Crafts) {
				CraftingItems[Crafts[i].result.toString()] = {};
				for (var k in Crafts[i].items) {
					if (CraftingItems[Crafts[i].result.toString()][Crafts[i].items[k].toString()]) {
						CraftingItems[Crafts[i].result.toString()][Crafts[i].items[k].toString()]++;
					} else {
						CraftingItems[Crafts[i].result.toString()][Crafts[i].items[k].toString()] = 1;
					}
				}
				CraftingItems[Crafts[i].result.toString()].centre = Crafts[i].centre.toString();
			}
			var itemsInPedestals = {};
			for (var i in pedestals) {
				var tile = World.getTileEntity(pedestals[i][0], this.y, pedestals[i][1]);
				var item = tile.container.getSlot('slot');
				if (itemsInPedestals[item.id + ',' + item.data]) {
					itemsInPedestals[item.id + ',' + item.data]++
				} else {
					itemsInPedestals[item.id + ',' + item.data] = 1
				}
			}
			devLog(JSON.stringify(itemsInPedestals));
			var centreItem = this.container.getSlot('slot').id + ',' + this.container.getSlot('slot').data;
			var result = 0
			for (var l in CraftingItems) {
				result = 0
				for (var i in itemsInPedestals) {
					if (centreItem != CraftingItems[l].centre || JSONlength(itemsInPedestals) != JSONlength(CraftingItems[l]) - 1 || !CraftingItems[l][i] || itemsInPedestals[i] != CraftingItems[l][i]) continue;
					result++
					if (result == JSONlength(itemsInPedestals) || typeof (result) == 'string') {
						result = l;
						break
					};
				}
				if (result == JSONlength(itemsInPedestals) || typeof (result) == 'string') break;
			}
			if (typeof (result) == 'string') {
				if (onCraftStart[result] && onCraftStart[result]({
					x: this.x,
					y: this.y,
					z: this.z
				}) == 'stop') return;
				for (var i in pedestals) {
					pedestals[i] = pedestals[i][0] + ";" + pedestals[i][1];
				}
				pedestals = pedestals.toString();
				this.data.step = {
					pedestals: pedestals,
					result: result
				};
				pedestals = pedestals.split(",");
				for (var i in pedestals) {
					pedestals[i] = pedestals[i].split(";");
					pedestals[i][0] = Number(pedestals[i][0]);
					pedestals[i][1] = Number(pedestals[i][1]);
				}
				var ths = this;
				asd(pedestals, 0, ths, function () {
					result = result.split(',');
					var ent = Entity.spawn(ths.x, ths.y + 1, ths.z, 93);
					if (ths.container.getSlot('slot').count > 1) {
						onCallback("EntityRemoved", function (entity) {
							if (entity == ent) {
								drop(ths.x + 0.5, ths.y + 1, ths.z + 0.5, result[0], 1, result[1]);
								return "delete";
							}
						});
						ths.container.getSlot('slot').count--;
					} else {
						ths.container.setSlot('slot', result[0], 1, result[1]);
					}
					ths.data.step = null;
					if (onCraftEnd[result.toString()]) onCraftEnd[result.toString()]({
						x: ths.x,
						y: ths.y,
						z: ths.z
					});
				});
			}
			return true;
		} else if (this.container.getSlot('slot').id == 0) {
      Game.prevent();
			  var item = Player.getCarriedItem();
			  if (item.id == 0) return;
			  this.container.setSlot('slot', item.id, 1, item.data, item.extra);
			  Player.decreaseCarriedItem(1);
		} else {
			Game.prevent();
			this.container.dropAt(this.x + 0.5, this.y + 1, this.z + 0.5);
		}
		return true;
	},
	tick: function () {
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
			this.data.rotation = [0, 0, 0];
			if (all_items.indexOf(item.id) != -1) {
				bonus_coords.x -= 0.06 - 1 / 16;
				bonus_coords.y -= 0.095 + 1 / 16 / (1 / (1 / (16 / 6))) * 3.5;
				bonus_coords.z += 0.06125 - 1 / 16;
				this.data.rotation = [Math.PI / 2, Math.PI, 0];
			}
			this.data.anim = new Animation.Item(this.x + 0.5 + 1 / 16 - 1 / 16 + bonus_coords.x, this.y + 0.75 + 0.125 + 1 / 16 / (1 / (1 / (16 / 6))) * 3.5 + bonus_coords.y, this.z + 0.5 - 1 / 16 + 1 / 16 + bonus_coords.z);
			this.data.anim.describeItem({
				id: item.id,
				count: 1,
				data: item.data,
				size: 1 / (16 / 6),
				rotation: this.data.rotation,
				notRandomize: true
			});
			this.data.anim.load();
		} else if (this.data.anim && item.id == 0) {
			this.data.lastid = 0;
			this.data.lastdata = 0;
			this.data.anim.destroy();
			this.data.anim = null;
		}
	},
	init: function () {
		if (this.data.anim) this.data.anim.load();
		if (this.data.step) {
			if (!this.data.step.i) return;
			var ths = this;
			var pedestals = ths.data.step.pedestals.split(",");
			for (var i in pedestals) {
				pedestals[i] = pedestals[i].split(";");
				pedestals[i][0] = Number(pedestals[i][0]);
				pedestals[i][1] = Number(pedestals[i][1]);
			}
			asd(pedestals, ths.data.step.i, ths, function () {
				var result = ths.data.step.result.split(',');
				var ent = Entity.spawn(ths.x, ths.y + 1, ths.z, 93);
				if (ths.container.getSlot('slot').count > 1) {
					onCallback("EntityRemoved", function (entity) {
						if (entity == ent) {
							drop(ths.x + 0.5, ths.y + 1, ths.z + 0.5, result[0], 1, result[1]);
							return "delete";
						}
					});
					ths.container.getSlot('slot').count--
				} else {
					ths.container.setSlot('slot', result[0], 1, result[1]);
				}
				ths.data.step = null;
				if (onCraftEnd[result.toString()]) onCraftEnd[result.toString()]({
					x: ths.x,
					y: ths.y,
					z: ths.z
				});
			});
		}
	},
	destroyBlock: function (coords, player) {
		if (this.data.anim) {
			this.data.anim.destroy();
		}
	}
});

function particles(tableCoords, pedestalCoords, tile, slot, particleType, interval, repeates, endFunc, curentRepeat) {
	curentRepeat = curentRepeat || 1;
	if (World.getBlock(pedestalCoords.x, pedestalCoords.y, pedestalCoords.z).id == 0 || tile.container.getSlot("slot").id == 0 || World.getBlock(tableCoords.x, tableCoords.y, tableCoords.z).id == 0 || World.getTileEntity(tableCoords.x, tableCoords.y, tableCoords.z).container.getSlot("slot").id == 0) {
		return
	}
	if (curentRepeat > repeates) {
		if (tile.container.getSlot('slot').count == 1) {
			tile.container.setSlot('slot', 0, 0, 0);
		} else {
			tile.container.getSlot("slot").count--;
		}
		setTimeout(function () {
			endFunc();
		}, 40);
		return;
	}
	for (var i = 0.1; i < Math.random() / 2; i += 0.1) {
		var emitter = new Particles.ParticleEmitter(pedestalCoords.x + 0.5 + Math.random() / 5, pedestalCoords.y + 0.75 + Math.random() / 5, pedestalCoords.z + 0.5 + Math.random() / 5);
		emitter.setEmitRelatively(true);
		emitter.emit(particleType, 0, 0, 0, 0, 0, 0, 0, (tableCoords.x - pedestalCoords.x) / 40 / 20, (tableCoords.y - pedestalCoords.y) / 40 / 20, (tableCoords.z - pedestalCoords.z) / 40 / 20);
	}
	setTimeout(function () {
		particles(tableCoords, pedestalCoords, tile, slot, particleType, interval, repeates, endFunc, curentRepeat + 1);
	}, interval)
}

function asd(pedestals, i, tileTable, endFunc) {
	tileTable.data.step.i = i;
	if (i >= pedestals.length) return endFunc();
	var tile = World.getTileEntity(pedestals[i][0], tileTable.y, pedestals[i][1]);
	if (tile && tile.container.getSlot('slot').id != 0) {
		particles({
			x: tileTable.x,
			y: tileTable.y,
			z: tileTable.z
		}, {
			x: pedestals[i][0],
			y: tileTable.y,
			z: pedestals[i][1]
		}, tile, 'slot', particle_table, 3, 40, function () {
			asd(pedestals, i + 1, tileTable, endFunc)
		});
	} else {
		tileTable.data.step = null;
		//asd(pedestals, i + 1, tileTable, endFunc)
	}
}