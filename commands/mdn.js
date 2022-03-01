const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const searchMDN = require("../utils/mdndocs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mdn")
    .setDescription("Replies with links to the MDN Docs!")
    .addStringOption((opt) =>
      opt
        .setName("query")
        .setDescription(
          "Enter a phrase and search through the MDN Docs . Example: Array.filter"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString("query");

    await interaction.deferReply();

    const res = await searchMDN(query);

    const embed = new MessageEmbed()
      .setColor("#6DD4AF")
      .setTitle("MDN Docs")
      .setURL("https://developer.mozilla.org/en-US/")
      .setDescription(`Results from ${query}`)
      .setThumbnail("https://developer.mozilla.org/favicon-48x48.cbbd161b.png")
      .setTimestamp();

    if (res.length) {
      res.forEach((v) => {
        embed.addField(v.loc, `[Click here to view the docs](${v.url})`);
      });
    } else {
      embed.addField("Ops..", "Cannot find anything");
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
