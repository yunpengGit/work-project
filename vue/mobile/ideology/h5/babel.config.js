/*
 * @Description:
 * @Author: peng
 * @Date: 2021-08-10 15:15:51
 * @LastEditors: peng
 * @LastEditTime: 2021-08-10 15:22:15
 */
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true,
      },
      "vant",
    ],
  ],
};
