using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBlog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPostIdToContentAssets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PostId",
                table: "ContentAssets",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContentAssets_PostId",
                table: "ContentAssets",
                column: "PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContentAssets_Posts_PostId",
                table: "ContentAssets",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentAssets_Posts_PostId",
                table: "ContentAssets");

            migrationBuilder.DropIndex(
                name: "IX_ContentAssets_PostId",
                table: "ContentAssets");

            migrationBuilder.DropColumn(
                name: "PostId",
                table: "ContentAssets");
        }
    }
}
