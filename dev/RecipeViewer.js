const RVSettings = {
	size: 80,
	centre: {
		x: 500,
		y: 275
	},
	Rmul: 2.8,
	AngleMul: 0.8,
	Divider: 2.5
}

ModAPI.addAPICallback('RecipeViewer', function(RV) {
	RV.Core.registerRecipeType("MagicTable", {
		contents: {
			icon: ItemID.magicTable_item,
			elements: {
				input15: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 - RVSettings.size * (RVSettings.Rmul / RVSettings.Divider),
					y: RVSettings.centre.y - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul /*10*/
				},
				input0: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 /*460*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul /*10*/
				},
				input1: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 + RVSettings.size * (RVSettings.Rmul / RVSettings.Divider),
					y: RVSettings.centre.y - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul /*10*/
				},

				input2: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*610*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*60*/
				},

				input3: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul /*660*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 - RVSettings.size * (RVSettings.Rmul / RVSettings.Divider)
				},
				input4: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul /*660*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 /*210*/
				},
				input5: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul /*660*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 + RVSettings.size * (RVSettings.Rmul / RVSettings.Divider)
				},

				input6: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*610*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*360*/
				},

				input7: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 + RVSettings.size * (RVSettings.Rmul / RVSettings.Divider),
					y: RVSettings.centre.y - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul /*410*/
				},
				input8: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 /*460*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul /*410*/
				},
				input9: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 - RVSettings.size * (RVSettings.Rmul / RVSettings.Divider),
					y: RVSettings.centre.y - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul /*410*/
				},

				input10: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*310*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 + RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*360*/
				},

				input11: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul /*260*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 + RVSettings.size * (RVSettings.Rmul / RVSettings.Divider)
				},
				input12: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul /*260*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 /*210*/
				},
				input13: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul /*260*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 - RVSettings.size * (RVSettings.Rmul / RVSettings.Divider)
				},

				input14: {
					type: "slot",
					size: RVSettings.size,
					x: RVSettings.centre.x - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*310*/ ,
					y: RVSettings.centre.y - RVSettings.size / 2 - RVSettings.size * RVSettings.Rmul * RVSettings.AngleMul /*60*/
				},

				input16: {
					type: "slot",
					size: RVSettings.size * 1.2,
					x: RVSettings.centre.x - RVSettings.size / 2,
					y: RVSettings.centre.y - RVSettings.size / 2
				},

				output0: {
					type: "slot",
					x: 840,
					y: 215,
					size: 120
				},
			}
		},
		getList: function(id, data, isUsage) {
			//isUsage == true -> what crafting recipes it is used in
			//isUsage == false -> to craft that item
			var list = [];
			var crafts;
			if (isUsage) {
				crafts = [];
				Crafts.find(function(element, index, array) {
					var added = false;
					for (var l in element.items) {
						if (element.items[l][0] == id && element.items[l][1] == data && !added) {
							crafts.push(element);
							added = true;
						}
					}
					if (element.centre[0] == id && element.centre[1] == data && !added) {
						crafts.push(element);
						added = true;
					}
				})
			} else {
				crafts = MagicTable.getCrafts([id, data]);
			}
			//log(JSON.stringify(crafts));
			for (var i in crafts) {
				var input = []
				if (crafts[i].rv) {
					for (var k in crafts[i].rv) {
						if (crafts[i].rv[k] == -1) {
							input.push({
								id: 0,
								count: 0,
								data: 0
							});
						} else {
							input.push({
								id: Number(crafts[i].items[crafts[i].rv[k]][0]),
								count: 1,
								data: Number(crafts[i].items[crafts[i].rv[k]][1])
							});
						}
					}
				} else {
					for (var k in crafts[i].items) {
						input.push({
							id: Number(crafts[i].items[k][0]),
							count: 1,
							data: Number(crafts[i].items[k][1])
						});
					}
				}
				if (input.length < 16) {
					for (var k = input.length; k < 16; k++) {
						input.push({
							id: 0,
							count: 0,
							data: 0
						});
					}
				}
				input.push({
					id: Number(crafts[i].centre[0]),
					count: 1,
					data: Number(crafts[i].centre[1])
				});
				list.push({
					input: input,
					output: [{
						id: Number(crafts[i].result[0]),
						count: 1,
						data: Number(crafts[i].result[1])
					}]
				});
			}
			return list;
		}
	});
})