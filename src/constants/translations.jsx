export const tooltips = {
	duplicate_ontology_id: "This Ontology ID already exists. Saving disabled.",
	selection_unavailable: "Selected item is unknown in the ELN lab setup. Item will be kept when changing and saving other values.",
	selection_inactive: "Selected item has been removed from the ELN lab setup. Item will be kept when changing and saving other values.",
	selection_unmet_dependency: "Selected item does not meet its dependency requirements.",
	action_unmet_automation_mode: "The automation mode of the current Step has been changed. This action has fields depending on the automation mode. Please check this action. Saving unchanged will resolve this warning.",
	vessel_unmet_automation_mode: "Selected Vessel is not available in the current Automation mode",
	purification_amount: 'Please add volume for manual purification',
	purification_duration: 'Please add the duration of the step for manual purification.'
}

export const notifications = {
	network: {
		error: {
			server_not_reachable: {
				title: "Network Error",
				message: "Network connection to Backend failed. Is the ELN server running and reachable?",
				type: "error",
			}
		}
	},
	automation_mode: {
		has_been_changed: {
			title: "You changed the Step Automation-Mode.",
			message: "Changes in the automation mode will impact some Actions and their forms. The affected actions can not get altered implicitly. Please check manually and adapt and correct Actions where required!",
			type: "warning",
			messageCloseTime: 8000
		}
	}
}
