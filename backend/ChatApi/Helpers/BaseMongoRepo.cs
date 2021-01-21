using MongoDB.Driver;

namespace ChatApi.Helpers
{
    public class BaseMongoRepo
    {
        protected IMongoDatabase mongoDatabase;

        public BaseMongoRepo(IDbSettings settings) {
            var mongoClient = new MongoClient(settings.ConnectionString);
            mongoDatabase = mongoClient.GetDatabase(settings.DatabaseName);
        }
    }
}