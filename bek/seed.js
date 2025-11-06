// желательно добавить
// добавить функцию смены статистики играков каждую новую неделю

// это не так важно можно и не добовлять
// один раунд соревнований между игроками идет одну неделю по итого которой во вкладек
// соревнования  таблица в которой  остается 3 самых результативных игрока и видно дату начала и конуа соревнований

const { User, Team, Player, TeamPlayer, sequelize } = require("./models");

async function seedDatabase() {
  try {
    console.log("Начало заполнения БД...");
    await TeamPlayer.destroy({ where: {} });
    await Team.destroy({ where: {} });
    await Player.destroy({ where: {} });
    await User.destroy({ where: {} });

    const users = await User.bulkCreate([
      {
        name: "Admin",
        email: "admin@admin.com",
        password: "admin",
        role: "admin",
      },
      {
        name: "Ивано Петров",
        email: "user@user.com",
        password: "user",
      },
      {
        name: "Мария Петрова",
        email: "user1@user.com",
        password: "user",
      },
    ]);

    // CSKA Moscow – 19 игроков
    const CSKA_MOSCOW = await Player.bulkCreate([
      {
        name: "Алекса Аврмович",
        points: 12.1,
        podboru: 2.8,
        peredachu: 3.3,
        folv: 1.6,
        perexvat: 1.3,
        poteri: 1.6,
        blokchotu: 0.1,
        avatar: "/bek/img/цска/87-avramovic-1500.jpg",
      }, // 95
      {
        name: "Алекса 1 Аврмович",
        points: 12.1,
        podboru: 2.8,
        peredachu: 3.3,
        folv: 1.6,
        perexvat: 1.3,
        poteri: 1.6,
        blokchotu: 0.1,
        avatar: "/bek/img/цска/87-avramovic-1500.jpg",
      }, // 95
      {
        name: "Алекса 2 Аврмович",
        points: 12.1,
        podboru: 2.8,
        peredachu: 3.3,
        folv: 1.6,
        perexvat: 1.3,
        poteri: 1.6,
        blokchotu: 0.1,
        avatar: "/bek/img/цска/87-avramovic-1500.jpg",
      }, // 95
    ]);

    const team1 = await Team.create({
      name: "asdfasf",
      user_id: users[1].id,
      logo: "",
      total_points: 180.5,
    });

    const team2 = await Team.create({
      name: "qwe",
      user_id: users[2].id,
      logo: "",
      total_points: 130.5,
    });

    await team1.addPlayers([players[0], players[1]]);
    await team2.addPlayers([players[2]]);

    console.log("Тестовые данные добавлены!");
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}
//

seedDatabase();
// const team2 = await Team.create([
//     name: 'asdfasf',
//     user_id: 1,
//     logo: ''
// ])

// const team3 = await Team.create([
//     name: 'asdfasf',
//     user_id: 1,
//     logo: ''
// ])
