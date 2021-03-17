function filter_boards(search_string) {
	$(".board_hidden").removeClass("board_hidden");
	$(".this_module").removeClass("this_module");
	if(search_string.trim() == "") {
		var nvisible = $("#filtered_table tbody tr").length;
		$("#filter_num").html("("+nvisible+")");
		return;
	}
	var nvisible = 0;
	$("#filtered_table tbody tr").each( (index,item) => {
		var name = $(item).find("td:first-child p").html();
		var modules = $(item).find("a.reference.internal");
		var matching_all = true;
		//
		var list_search = search_string.split(" ").filter(i => i);
		list_search.forEach((sstring) => {
			var matching = (sstring[0] == "-");
			for(var modi = 0; modi < modules.length; ++modi) {
				module = modules[modi];
				var mod_name = module.firstChild.firstChild.textContent;
				if(sstring[0] == "-") {
					if(mod_name.match(sstring.substr(1))) {
						matching = false;
						break;
					}
				} else {
					if(mod_name.match(sstring)) {
						$(module).addClass("this_module");
						matching = true;
					}
				}
			}
			matching_all = matching_all && matching;
		});
		if(!matching_all) {
			$(item).addClass("board_hidden");
		} else {
			nvisible += 1;
		}
	});
	$("#filter_num").html("("+nvisible+")");
}

$(() => {
	function run_filter() {
		var search_string = $("#filter").val();
		console.log("search_string",search_string);
		filter_boards(search_string);
	}
	$("#filter").on("keyup", run_filter);
	var nvisible = $("#filtered_table tbody tr").length;
	$("#filter_num").html("("+nvisible+")");
	run_filter();
});
