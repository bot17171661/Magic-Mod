const peaceful_mobs = [19, 10, 11, 20, 22, 12, 63, 18, 13, 21, 17, 15, 14];

IDRegistry.genItemID("magicWand");
Item.createItem("magicWand", "Magic Wand", {
	name: "magic_wand"
}, {
	stack: 1
});
mod_tip(ItemID["magicWand"]);

var particle_air = Particles.registerParticleType({
	texture: "air",
	size: [1, 15],
	lifetime: [40, 120],
	render: 2,
	animators: {
		size: {
			period: 120,
			fadeIn: 1,
			fadeOut: 0,
			start: 0.2,
			end: 1
		}
	},
});
var gI = 1;
var lens_selection_menu = new UI.Window({
	location: {
		width: 400,
		height: 400,
		x: 300,
		y: 50 + 20
	},
	params: {

	},
	drawing: [{
		type: "color",
		color: android.graphics.Color.TRANSPARENT
	}],
	elements: {
		"image": {
			type: "image",
			x: 0,
			y: 0,
			z: -1,
			bitmap: "frame1",
			scale: 1000/256,
		},
		"desc": {
			type: "text",
			x: 275,
			y: 275,
			text: "",
			font: {
				color: android.graphics.Color.WHITE,
				shadow: 0.5,
				size: 30
			}
		}
	}
});
lens_selection_menu.setAsGameOverlay(true);
var container = new UI.Container();

var fireballs = [];

var sound_air = new Sound("air.ogg");
var sound_air2 = new Sound("air2.ogg");
var sound_interval;
var interval;

var drop_mob = false;
var mob_captured;
var tel_window = new UI.Window({
	location: {
		width: 60,
		height: 60 * 2,
		x: 0,
		y: 150
	},
	drawing: [{
		type: "color",
		color: android.graphics.Color.TRANSPARENT
	}],
	elements: {
		"button_push": {
			x: 0,
			y: 0,
			type: "button",
			bitmap: "tel_push",
			scale: 50,
			clicker: {
				onClick: function (position, container, tileEntity, window, canvas, scale) {
					drop_mob = true;
					var vel = Entity.getLookVector(Player.get());
					Entity.addVelocity(mob_captured, vel.x * 5, vel.y * 5, vel.z * 5);
				}
			}
		},
		"button_drop": {
			x: 0,
			y: 1000,
			type: "button",
			bitmap: "tel_drop",
			scale: 50,
			clicker: {
				onClick: function (position, container, tileEntity, window, canvas, scale) {
					drop_mob = true;
				}
			}
		}
	}
})
var tel_container = new UI.Container();
tel_window.setAsGameOverlay(true);

var nature_window = new UI.Window({
	location: {
		width: 80,
		height: 80,
		x: 930,
		y: UI.getScreenHeight() / 2 - 50
	},
	drawing: [{
		type: "color",
		color: android.graphics.Color.TRANSPARENT
	}],
	elements: {
		"subbutton": {
			x: -1000,
			y: -1000,
			type: "button",
			bitmap: "tel_push",
			scale: 150,
			onTouchEvent: function (a, event) {
				if ((event.localX <= 1 / 3 || event.localX >= 2 / 3) || (event.localY <= 1 / 3 || event.localY >= 2 / 3)) nature_stop();
			}
		},
		"button": {
			x: 0,
			y: 0,
			type: "button",
			bitmap2: "nature_button_pressed",
			bitmap: "nature_button",
			scale: 50,
			onTouchEvent: function (a, event) {
				if (event.type == "DOWN") {
					nature_start()
				}
				if (event.type == "UP" || event.type == "CLICK") {
					nature_stop()
				}
			}
		}
	}
})
nature_window.setAsGameOverlay(true);
var nature_container = new UI.Container();

var lenses = [{
	name: "Air",
	texture: "airLense",
	description: "The wind will push you up and when you attack the mobs, the wind will push them further away\n\nOn use no target: You fly up\nOn attack: The mob pushes further",
	onUseNoTarget: function (item) {
		sound_air.stop();
		clearInterval(interval);
		var speed = 0.15;
		sound_air.play();
		sound_air.setLooping(true);
		interval = setInterval(function () {
			if (Player.getCarriedItem().id != ItemID.magicWand || Player.getCarriedItem().data != 1) {
				sound_air.stop();
				sound_air.setLooping(false);
				return true;
			}
			if (Entity.getSneaking(Player.get())) {
				sound_air2.stop();
				sound_air.stop();
				sound_air.setLooping(false);
				return false;
			} else if (!sound_air.isPlaying()) {
				sound_air.play();
				sound_air.setLooping(true);
			}
			if (Player.getVelocity().y < 0) {
				speed = Player.getVelocity().y + 0.2;
			} else if (Player.getVelocity().y > 1) {
				speed = Player.getVelocity().y - 0.2;
			} else {
				speed = 0.15;
			}
			if (Math.random() >= 0.75) sound_air2.play();
			Player.setVelocity(Player.getVelocity().x, speed, Player.getVelocity().z);
			var player_pos = Player.getPosition();
			var emitter = new Particles.ParticleEmitter(player_pos.x, player_pos.y - 2.5, player_pos.z);
			emitter.setEmitRelatively(true);
			emitter.emit(particle_air, 0, 0, 0, 0, 0, 0.18, 0, 0, 0, 0);
		}, 1);
	},
	onPlayerAttack: function (player, victim) {
		var vel = Entity.getLookVector(player);
		Entity.addVelocity(victim, vel.x * 2, 0, vel.z * 2);
		var player_pos = Player.getPosition();
		var emitter = new Particles.ParticleEmitter(player_pos.x, player_pos.y, player_pos.z);
		emitter.setEmitRelatively(true);
		emitter.emit(particle_air, 0, 0, 0, 0, 0, 0, 0, vel.x / 10, vel.y / 10, vel.z / 10);
		sound_air.play();
	}
},
{
	name: "Fire",
	description: "Launches fireballs and sets fire to blocks\n\nOn use no target: Launch fareball\nOn use: Set fire",
	texture: "fireLense",
	onUseNoTarget: function (item) {
		var pos = Player.getPosition();
		var vel = Entity.getLookVector(Player.get());
		var entity = Entity.spawn(pos.x + vel.x * 2, pos.y + vel.y * 2, pos.z + vel.z * 2, 85);
		Entity.setVelocity(entity, vel.x, vel.y, vel.z);
	},
	onUse: function (coords, item, block) {
		World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, 51, 0);
	},
	onPlayerAttack: function (player, victim) {
		Entity.setFire(victim, 120);
	}
},
{
	name: "Blood",
	description: "Restores health through target health\n\nWhen using on a mob: Inflicts 1hp to a mob and restore 1hp you\nOn use no target: If a diamond lies nearby, it replaces it with a bloody one and takes 19hp from you",
	texture: "bloodLense",
	onUseNoTarget: function (item) {
		var pointed = getPointed();
		var pos = Player.getPosition();
		pos.y--;
		if (pointed.entity != -1) {
			Entity.damageEntity(pointed.entity, 1);
			Entity.healEntity(Player.get(), 1);
			return
		}
		var items = Entity.getAllInRange(pos, 5, 64);
		if (items.length != 0) {
			var diamond;
			for (var i in items) {
				if (Entity.getDroppedItem(items[i]).id == 264) {
					diamond = items[i];
					break;
				}
			}
			if (!diamond || Entity.getHealth(Player.get()) < 20) return;
			Entity.damageEntity(Player.get(), 19);
			pos = Entity.getPosition(diamond);
			var item = Entity.getDroppedItem(items[i]);
			item.count == 1 ? Entity.setDroppedItem(diamond, 0, 0, 0) : Entity.setDroppedItem(diamond, 264, item.count - 1, item.data);
			World.drop(pos.x, pos.y, pos.z, ItemID.bloodDiamond, 1, 0);
		}
	}
},
{
	name: "Telekinesis",
	texture: "telLense",
	description: "Allows you to lift mobs into the air and throw them far\n\nWhen using on a mob: raise mob\nLeft top button using for throw mob\nLeft down button using for let off mob",
	onUseNoTarget: function (item) {
		var pointed = getPointed();
		if (pointed.entity == -1) return;
		mob_captured = pointed.entity;
		var last = {
			x: 0,
			y: 0,
			z: 0
		};
		var lastp = {
			x: 0,
			y: 0,
			z: 0
		};
		if (!tel_container.isOpened()) tel_container.openAs(tel_window);
		setInterval(function () {
			var item = Player.getCarriedItem();
			if (pointed.entity != mob_captured) drop_mob = true;
			if (item.id != ItemID.magicWand || item.data != 4) drop_mob = true;
			if (drop_mob) {
				drop_mob = false;
				mob_captured = false;
				tel_container.close();
				return true;
			}
			var pos = Player.getPosition();
			var vec = Entity.getLookVector(Player.get());
			if (vec.x == 0 && vec.y == 0 && vec.z == 1) {
				vec.x = last.x, vec.y = last.y, vec.z = last.z;
			}
			last.x = vec.x, last.y = vec.y, last.z = vec.z;
			/*if(lastp.x != pos.x, lastp.y != pos.y, lastp.z != pos.z) log(JSON.stringify(pos));
			lastp = pos;*/
			var target_pos = {
				x: pos.x + vec.x * 5,
				y: pos.y + vec.y * 5,
				z: pos.z + vec.z * 5
			}
			Entity.moveToTarget(pointed.entity, target_pos, {
				speed: 10,
				denyY: false,
				jumpVel: 10
			})
		}, 1)
	}
},
{
	name: "Nature",
	description: "",
	texture: "natureLense",
	onSelected: function (item) {
		if (!nature_container.isOpened() && _LevelDisplayed) nature_container.openAs(nature_window);
	},
	onDeSelected: function (item) {
		if (nature_container.isOpened()) nature_container.close();
	}
}
]

var lens = {
	/*
		data = {
			name: string,
			description: string,
			texture: string,
			onUse: function(coords, item, block),
			onUseNoTarget: function(item),
			onPlayerAttack: function(player, victim),
			onSelected: function(item),
			onDeSelected: function(item)
		}
		Returns item.data stuff with lens
	*/
	add: function (data) {
		if (!data) return Logger.Log("Data not listed", "MagicModAPI ERROR");
		if (!data.name) return Logger.Log("Name not listed", "MagicModAPI ERROR");
		if (!data.texture) return Logger.Log("Texture not listed", "MagicModAPI ERROR");
		lenses.push(data);
		return lenses.length;
	},
	/*
		name: string
	*/
	remove: function (name) {
		if (!name) return Logger.Log("Name not listed", "MagicModAPI ERROR");
		lenses.splice(lenses.find(function (element, index, array) {
			if (element.name == name) return index;
		}), 1)
	},
	/*
		name: string
	*/
	get: function (name) {
		if (!name) return Logger.Log("Name not listed", "MagicModAPI ERROR");
		return lenses.find(function (element, index, array) {
			if (element.name == name) return element;
		})
	}
}

Callback.addCallback("APILoaded", function () {
	for (var i in lenses) {
		IDRegistry.genItemID("LensOf" + lenses[i].name);
		Item.createItem("LensOf" + lenses[i].name, "Lens Of " + lenses[i].name, {
			name: lenses[i].texture
		}, {
			stack: 1
		});
		mod_tip(ItemID["LensOf" + lenses[i].name]);
	}
});

Callback.addCallback('NativeGuiChanged', function (screenName) {
	if (screenName == 'hud_screen' || screenName == 'in_game_play_screen') {
		if (nature_container.isOpened()) return;
		var item = Player.getCarriedItem();
		if (item.id == ItemID.magicWand && item.data == 5) {
			nature_container.openAs(nature_window);
		}
	} else {
		if (nature_container.isOpened()) {
			nature_container.close();
			nature_stop();
		}
	}
});

function _regeneration() {
	var entities = Entity.getAllInRange(Player.getPosition(), 5);
	for (var i in entities) {
		if (peaceful_mobs.indexOf(Entity.getType(entities[i])) != -1) {
			Entity.addEffect(entities[i], 10, 1, 60);
		}
	}
	Entity.addEffect(Player.get(), 10, 0, 60);
}

nature_started = false;
function nature_start() {
	if (nature_started) return;
	nature_started = true;
	setInterval(function () {
		if (!nature_started) return true;
		_regeneration();
	}, 40, true);
	setInterval(function () {
		if (!nature_started) return true;
		Game.tipMessage('§a' + Translation.translate('Nature lens active'));
		var coords = { x: Player.getPosition().x + _randomInt(-5, 5), y: Player.getPosition().y, z: Player.getPosition().z + _randomInt(-5, 5) };
		coords.y = _find_block_y(coords);
		if (World.getBlock(coords.x, coords.y, coords.z).id == 3) {
			World.destroyBlock(coords.x, coords.y, coords.z, false);
			World.setBlock(coords.x, coords.y, coords.z, 2);
		}
		coords = { x: Player.getPosition().x + _randomInt(-5, 5), y: Player.getPosition().y, z: Player.getPosition().z + _randomInt(-5, 5) };
		coords.y = _find_block_y(coords);
		var flowers = [[37, 0, 0], [31, 1, 2], [38, 0, 8]];
		if (World.getBlock(coords.x, coords.y, coords.z).id == 2 && Math.random() <= 0.25) {
			var i = _randomInt(0, flowers.length - 1);
			World.setBlock(coords.x, coords.y + 1, coords.z, flowers[i][0], _randomInt(flowers[i][1], flowers[i][2]));
		}
	}, 5);
}
function nature_stop() {
	if (!nature_started) return;
	nature_started = false;
	Game.tipMessage(' ');
}

Item.registerNoTargetUseFunction("magicWand", function (item) {
	if (item.data == 0) return;
	if (lenses[item.data - 1].onUseNoTarget) lenses[item.data - 1].onUseNoTarget(item);
});

Callback.addCallback("PlayerAttack", function (player, victim) {
	var item = Player.getCarriedItem();
	if (item.id == ItemID.magicWand) {
		if (item.data == 0) return;
		if (lenses[item.data - 1].onPlayerAttack) lenses[item.data - 1].onPlayerAttack(player, victim);
	}
});

var _last_item = {};
Callback.addCallback("tick", function (player, victim) {
	var item = Player.getCarriedItem();
	if (JSON.stringify(item) == JSON.stringify(_last_item)) return;
	//alert(JSON.stringify(item));
	if (item.id == ItemID.magicWand) {
		if (item.data == 0) return;
		if (lenses[item.data - 1].onSelected) lenses[item.data - 1].onSelected(item);
	}
	if (_last_item.id == ItemID.magicWand) {
		if (_last_item.data == 0) return;
		if (lenses[_last_item.data - 1].onDeSelected) lenses[_last_item.data - 1].onDeSelected(_last_item);
	}
	_last_item = item;
});

Item.registerNameOverrideFunction(ItemID.magicWand, function (item, name) {
	name = "§b" + name
	if (item.data == 0) return name + "\n§7" + Translation.translate('Lens') + ': ' + Translation.translate('Nope');
	if (lenses[item.data - 1]) {
		return name + "\n§7" + Translation.translate('Lens') + ': ' + Translation.translate(lenses[item.data - 1].name);
	} else {
		return name + "\n§7" + Translation.translate('Lens') + ': ' + Translation.translate('Nope');
	}
});

Item.registerUseFunction("magicWand", function (coords, item, block) {
	if (block.id == BlockID.magicTable) return;
	if (Entity.getSneaking(Player.get())) {
		if (item.data == 0) {
			if (container.isOpened) container.close();
			container.openAs(lens_selection_menu);
			var content = container.getGuiContent();
			var items = [];
			for (var i in lenses) {
				var item = searchItem(ItemID["LensOf" + lenses[i].name], -1);
				if (item) {
					items.push([item.id, item.data, item.slot]);
				}
			}
			content.elements["desc"].text = "";
			for (var i = 1; ; i++) {
				if (!content.elements["desc" + i]) break;
				content.elements["desc" + i] = null;
			}
			for (var i in content.elements) {
				if (i.substr(0, 4) != 'slot') continue;
				delete content.elements[i];
			}
			for (var i in container.slots) {
				container.setSlot(i, 0, 0, 0);
				delete container.slots[i];
			}
			for (var i = 2 / items.length; i <= 2; i += 2 / items.length) {
				var k = Math.round(i / (2 / items.length));
				content.elements['slot' + k] = {
					slot: 'slot' + k,
					type: 'slot',
					x: Math.sin(Math.PI * i) * 385 + (500 - 100),
					y: Math.cos(Math.PI * i) * -1 * 385 + (500 - 100),
					size: 200,
					bitmap: "_default_slot_empty",
					visual: true,
					isTransparentBackground: true,
					clicker: {
						onClick: function (position, container, tileEntity, window, canvas, scale) {
							var item = container.getSlot(this.slot);
							if (item.id == 0) return;
							Player.setInventorySlot(searchItem(item.id, -1).slot, 0, 0, 0);
							var data = 0;
							for (var i in lenses) {
								if (ItemID["LensOf" + lenses[i].name] == item.id) data = (+i) + 1;
							}
							Player.setCarriedItem(ItemID.magicWand, 1, data);
							container.setSlot(this.slot, 0, 0, 0);
							container.close();
						},
						onLongClick: function (position, container, tileEntity, window, canvas, scale) {
							if (container.getSlot(this.slot).id == 0) return;
							var cont = container.getGuiContent();
							for (var i = 1; i <= items.length; i++) {
								cont.elements['slot' + i].bitmap = "_default_slot_empty";
							}
							cont.elements["desc"].text = "";
							for (var i = 1; ; i++) {
								if (!cont.elements["desc" + i]) break;
								cont.elements["desc" + i] = null;
							}
							cont.elements[this.slot].bitmap = "selected_slot";
							var item = container.getSlot(this.slot);
							var data = 0;
							for (var i in lenses) {
								if (ItemID["LensOf" + lenses[i].name] == item.id) data = (+i) + 1;
							}
							var text = Translation.translate("Description") + ": " + Translation.translate(lenses[data - 1].description);
							var last_sim = 0;
							for (var i = 0; i < Math.trunc(text.length / 25); i++) {
								text = setCharAt(text, text.substr(last_sim, 25).lastIndexOf(" ") + last_sim, "\n");
								last_sim += 25;
							}
							var splited = text.split("\n");
							cont.elements.desc.text = splited[0];
							var y = 35;
							for (var i = 1; i < splited.length; i++) {
								cont.elements["desc" + i] = {
									type: "text",
									x: 275,
									y: 275 + y,
									text: splited[i],
									font: {
										color: android.graphics.Color.WHITE,
										shadow: 0.5,
										size: 30
									}
								};
								y += 35;
							}
						}
					}
				}
			}
			for (var i = 1; i <= items.length; i++) {
				container.setSlot("slot" + i, items[i - 1][0], 1, items[i - 1][1]);
			}
			close();
		} else {
			Player.setCarriedItem(item.id, 1, 0);
			Player.addItemToInventory(ItemID["LensOf" + lenses[item.data - 1].name], 1, 0);
		}
		return
	}
	if (item.data == 0) return;
	if (lenses[item.data - 1].onUse) lenses[item.data - 1].onUse(coords, item, block);
});

function stop_capture_on_death(entity) {
	if (entity == mob_captured) drop_mob = true;
}

Callback.addCallback("EntityDeath", stop_capture_on_death);
Callback.addCallback("EntityRemoved", stop_capture_on_death);

function close() {
	var last_look = getPointed().vec;
	setInterval(function () {
		if (!container.isOpened()) return true;
		var look = getPointed().vec;
		if (look.x != last_look.x || look.y != last_look.y || look.z != last_look.z) {
			container.close();
			return true;
		}
		if (Player.getCarriedItem().id != ItemID.magicWand || Player.getCarriedItem().data != 0) {
			container.close();
			return true;
		}
	}, 5);
}