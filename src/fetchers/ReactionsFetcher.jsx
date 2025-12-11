import { apiHostname } from '../constants';
import { useElnApi } from './elnApi';

export { useReactionsFetcher };

function useReactionsFetcher() {

  const api = useElnApi();

  return {
    index,
    indexOf,
    svgImage,
    collectionSelectOptions,
    reactionSelectOptions,
    getReactionProcess,
    getSampleProcess,
    geDefaultConditions,
    updateReactionDefaultConditions,
    updateUserDefaultConditions,
    updateProvenance,
    downloadOrd,
    updateReactionProcessVessel,
    updateSamplePreparation,
    deleteSamplePreparation,
    createProcessStep,
    updateProcessStep,
    deleteProcessStep,
    createActivity,
    updateActivity,
    deleteActivity,
    updateActivityPosition,
    updateProcessStepPosition,
    createFractionActivities,
    updateReactionProcess
  }

  function index() {
    var path = `/reactions`

    if (localStorage.getItem('filter_collection_id')) {
      path = path + '?' + new URLSearchParams({ collection_id: localStorage.getItem('filter_collection_id') })
    }
    return api.get(path);
  }

  function indexOf(name) {
    var path = `/` + name

    if (localStorage.getItem('filter_collection_id')) {
      path = path + '?' + new URLSearchParams({ collection_id: localStorage.getItem('filter_collection_id') })
    }
    return api.get(path);
  }

  function svgImage(reaction) {
    // Note that this is not an api call but a link target.
    return `${apiHostname}/images/reactions/${reaction.reaction_svg_file}`
  }

  // function svgImageLink(file) {
  //   // Note that this is not an api call but a link target.
  //   return `${apiHostname}/images/reactions/${file}`
  // }

  function collectionSelectOptions() {
    return api.get(`/collection_select_options`);
  }

  function geDefaultConditions() {
    return api.get(`/default_conditions`);
  }

  function reactionSelectOptions() {
    // {label:, value:} are piggybacked onto the /reactions
    // so index can be used conveniently for select options as well.
    return index();
  }

  function getReactionProcess(id) {
    return api.get(`/reactions/${id}/reaction_process`);
  }

  function getSampleProcess(id) {
    return api.get(`/samples/${id}/reaction_process`);
  }

  function updateProvenance(provenance) {
    return api.put(`/reaction_processes/${provenance.reaction_process_id}/provenance`,
      { 'provenance': provenance });
  }

  function updateReactionDefaultConditions(default_conditions) {
    return api.put(`/reaction_processes/${default_conditions.reaction_process_id}/reaction_default_conditions`,
      { 'default_conditions': default_conditions });
  }

  function updateUserDefaultConditions(default_conditions) {
    return api.put(`/user_default_conditions`,
      { 'default_conditions': default_conditions });
  }

  function downloadOrd(id) {
    return api.download(`/reaction_processes/${id}/ord`)
  }

  function updateReactionProcessVessel(reactionProcessVessel) {
    return api.put(`/reaction_process_vessels/${reactionProcessVessel.id}`, { 'reaction_process_vessel': reactionProcessVessel })
  }

  function updateReactionProcess(reactionProcessId, params) {
    return api.put(`/reaction_processes/${reactionProcessId}`, params)
  }

  function updateSamplePreparation(reactionProcessId, samplePreparation) {
    return api.put(`/reaction_processes/${reactionProcessId}/samples_preparations`,
      { 'sample_preparation': samplePreparation })
  }

  function deleteSamplePreparation(reactionProcessId, id) {
    return api.delete(`/reaction_processes/${reactionProcessId}/samples_preparations/${id}`)
  }

  function createProcessStep(reactionProcessId, processStep) {
    return api.post(`/reaction_processes/${reactionProcessId}/reaction_process_steps`,
      { 'reaction_process_step': processStep })
  }

  function updateProcessStep(processStep) {
    return api.put(`/reaction_process_steps/${processStep.id}`, { 'reaction_process_step': processStep })
  }

  function deleteProcessStep(id) {
    return api.delete(`/reaction_process_steps/${id}`)
  }

  function updateProcessStepPosition(id, position) {
    return api.put(`/reaction_process_steps/${id}/update_position`, { 'position': position })
  }

  function createActivity(processStepId, activity, insertBefore) {
    return api.post(`/reaction_process_steps/${processStepId}/activities`,
      { 'activity': activity, 'insert_before': insertBefore })
  }

  function createFractionActivities(activity, fractions) {
    return api.put(`/reaction_process_activities/${activity.id}/create_fraction_activities`, { 'fractions': fractions })
  }

  function updateActivity(activity) {
    return api.put(`/reaction_process_activities/${activity.id}`, { 'activity': activity })
  }

  function deleteActivity(id) {
    return api.delete(`/reaction_process_activities/${id}`)
  }

  function updateActivityPosition(id, position) {
    return api.put(`/reaction_process_activities/${id}/update_position`, { 'position': position })
  }
}
