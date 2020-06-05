Callback.addCallback("APILoaded", function () {
	Recipes.addShaped({id: ItemID.emptyLens, count: 1, data: 0}, [
		"did",
		"isi",
		"did"
	], ['d', 264, 0, 's', 102, 0, 'i', 265, 0]);//алмаз, панель, железо

	Recipes.addShaped({id: ItemID.magicWand, count: 1, data: 0}, [
		" gd",
		"gsg",
		"gg "
	], ['d', 264, 0, 's', 280, 0, 'g', 266, 0]);//алмаз, палка, золото

	Recipes.addShaped({id: ItemID.magicTable_item, count: 1, data: 0}, [
		"drd",
		"ooo",
		"ooo"
	], ['d', ItemID.bloodDiamond, 0, 'r', 171, 14, 'o', 49, 0]);//Кровавый алмаз, красный ковер, обсидиан

	Recipes.addShaped({id: ItemID.LensOfBlood, count: 1, data: 0}, [
		"rir",
		"ded",
		"rir"
	], ['e', ItemID.emptyLens, 0, 'i', 399, 0, 'r', 264, 0, 'd', 351, 5]);// Пустая линза, фиолетовый краситель, звезда ада, алмаз

	MagicTable.addCraft([[265, 0], [265, 0], [399, 0], [399, 0], [288, 0], [288, 0], [351, 11], [351, 11]], [ItemID.emptyLens, 0], [ItemID.LensOfAir, 0], [0,-1,7,-1,2,-1,4,-1,1,-1,6,-1,3,-1,5,-1]);// 2Железо,  2звезда ада, 2перо, 2желтый краситель, пустая линза
	MagicTable.addCraft([[265, 0], [265, 0], [399, 0], [399, 0], [377, 0], [289, 0], [351, 14], [263, 0]], [ItemID.emptyLens, 0], [ItemID.LensOfFire, 0], [0,-1,7,-1,2,-1,4,-1,1,-1,6,-1,3,-1,5,-1]);// 2Железо,  2звезда ада, огенный порошок, порох, оранжевый краситель, уголь, пустая линза
	MagicTable.addCraft([[265, 0], [265, 0], [399, 0], [399, 0], [420, 0], [420, 0], [351, 12], [351, 12]], [ItemID.emptyLens, 0], [ItemID.LensOfTelekinesis, 0], [0,-1,7,-1,2,-1,4,-1,1,-1,6,-1,3,-1,5,-1]);// 2Железо,  2звезда ада, 2поводок, 2голубой краситель, пустая линза
	MagicTable.addCraft([[265, 0], [265, 0], [399, 0], [399, 0], [370, 0], [370, 0], [322, 0], [322, 0]], [ItemID.emptyLens, 0], [ItemID.LensOfNature, 0], [0,-1,7,-1,2,-1,4,-1,1,-1,6,-1,3,-1,5,-1]);// 2Железо,  2звезда ада, 2слеза гаста, 2золотое яблоко, пустая линза
});