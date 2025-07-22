module.exports = class GitlabUtil {

  /**
   * Create a merge request on GitLab
   * @param {Object} options
   * @param {string} options.token - Your GitLab access token
   * @param {string} options.projectId - GitLab project path (e.g. "my-group/my-project")
   * @param {string} options.source - Source branch name
   * @param {string} options.target - Target branch name
   * @param {string} options.title - Merge request title
   * @param {string} [options.description] - Optional: description of the merge request
   * @param {boolean} [options.removesource] - Optional: remove source branch after merge
   * @returns {Promise<string>} The URL of the created merge request
   */
  static async createMergeRequest({
    token,
    projectId,
    source,
    target,
    title,
    description,
    removesource,
  }) {
    const encodedprojectId = encodeURIComponent(projectId);
    const form = new FormData();

    form.append('source_branch', source);
    form.append('target_branch', target);
    form.append('title', title);

    if (typeof description === 'string') {
      form.append('description', description);
    }

    if (typeof removesource === 'boolean') {
      form.append('remove_source_branch', String(removesource));
    }

    try {
      const response = await axios.post(
        `https://gitlab.com/api/v4/projects/${encodedprojectId}/merge_requests`,
        form,
        {
          headers: {
            'PRIVATE-TOKEN': token,
            ...form.getHeaders(),
          },
        }
      );

      console.log('Merge request created:', response.data.web_url);
      return response.data.web_url;
    } catch (error) {
      console.error('Failed to create merge request:', error.response?.data || error.message);
      throw error;
    }
  }

}