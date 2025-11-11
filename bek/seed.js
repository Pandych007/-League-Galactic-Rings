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
        name: "Мело Тримбл",
        points: 14.8,
        rebounds: 2.7,
        assists: 4.1,
        fouls: 2.1,
        steals: 1.6,
        turnovers: 1.9,
        blocks: 0.1,
        avatar: "/bek/img/цска/87-avramovic-1500.jpg",
        cost: 95.0,
      },
      // price 120,
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
        cost: 95.0,
      }, // 95
      {
        name: "Каспер Уэйр",
        points: 11.1,
        rebounds: 1.9,
        assists: 3.2,
        fouls: 1.8,
        steals: 0.7,
        turnovers: 1.2,
        blocks: 0.0,
      }, // price 90
      {
        name: "Тони Джекири",
        points: 10.7,
        rebounds: 5.2,
        assists: 1.0,
        fouls: 2.1,
        steals: 0.7,
        turnovers: 0.9,
        blocks: 0.4,
      }, // price 100
      {
        name: "Амат Мбайе",
        points: 10.3,
        rebounds: 2.8,
        assists: 1.5,
        fouls: 1.8,
        steals: 0.9,
        turnovers: 1.3,
        blocks: 0.4,
      }, // price 85
      {
        name: "Ливио Жан-Шарль",
        points: 10.1,
        rebounds: 4.1,
        assists: 1.1,
        fouls: 2.0,
        steals: 0.5,
        turnovers: 1.0,
        blocks: 0.5,
      }, // price 95
      {
        name: "Антон Астапкович",
        points: 7.6,
        rebounds: 3.7,
        assists: 1.6,
        fouls: 1.7,
        steals: 0.8,
        turnovers: 1.1,
        blocks: 0.2,
      }, // price 70
      {
        name: "Юрий Умрихин",
        points: 6.0,
        rebounds: 0.7,
        assists: 1.3,
        fouls: 1.3,
        steals: 0.0,
        turnovers: 0.7,
        blocks: 0.0,
      }, // price 50
      {
        name: "Иван Ухов",
        points: 5.4,
        rebounds: 2.9,
        assists: 2.0,
        fouls: 2.7,
        steals: 1.1,
        turnovers: 0.8,
        blocks: 0.1,
      }, // price 55
      {
        name: "Семен Антонов",
        points: 4.0,
        rebounds: 1.8,
        assists: 0.7,
        fouls: 1.7,
        steals: 0.4,
        turnovers: 0.3,
        blocks: 0.5,
      }, // price 40
      {
        name: "Никита Курбанов",
        points: 3.7,
        rebounds: 3.8,
        assists: 1.3,
        fouls: 1.6,
        steals: 0.5,
        turnovers: 0.5,
        blocks: 0.2,
      }, // price 45
      {
        name: "Руслан Абдулбасиров",
        points: 3.4,
        rebounds: 1.6,
        assists: 0.4,
        fouls: 0.2,
        steals: 0.3,
        turnovers: 0.2,
        blocks: 0.4,
      }, // price 35
      {
        name: "Владимир Карпенко",
        points: 3.1,
        rebounds: 0.7,
        assists: 0.9,
        fouls: 1.1,
        steals: 0.7,
        turnovers: 0.5,
        blocks: 0.0,
      }, // price 30
      {
        name: "Александр Ганькевич",
        points: 2.7,
        rebounds: 2.1,
        assists: 0.8,
        fouls: 1.4,
        steals: 0.2,
        turnovers: 0.5,
        blocks: 0.2,
      }, // price 28
      {
        name: "Никита Михайловский",
        points: 2.3,
        rebounds: 1.9,
        assists: 0.9,
        fouls: 1.0,
        steals: 0.0,
        turnovers: 0.3,
        blocks: 0.3,
      }, // price 25
      {
        name: "Нандо Де Коло",
        points: 14.7,
        rebounds: 2.5,
        assists: 3.4,
        fouls: 1.8,
        steals: 0.9,
        turnovers: 2.1,
        blocks: 0.0,
      }, // price 130
      {
        name: "Уилл Клайберн",
        points: 13.6,
        rebounds: 6.8,
        assists: 1.5,
        fouls: 1.9,
        steals: 1.0,
        turnovers: 1.4,
        blocks: 0.2,
      }, // price 120
      {
        name: "Серхио Родригес",
        points: 10.2,
        rebounds: 1.5,
        assists: 4.5,
        fouls: 2.1,
        steals: 0.7,
        turnovers: 2.2,
        blocks: 0.1,
      }, // price 110
      {
        name: "Отелло Хантер",
        points: 7.7,
        rebounds: 4.3,
        assists: 0.9,
        fouls: 2.3,
        steals: 0.5,
        turnovers: 0.8,
        blocks: 0.4,
      }, // price 75
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
