from neo4j import AsyncSession

class GraphEngine:
    async def get_shortest_safe_path(self, session: AsyncSession, start_node_id: str):
        """
        Executes a routing query in Neo4j to find the shortest
        path from the user's location to any Exit node,
        while strictly avoiding nodes marked as 'safe: False'.
        """
        query = """
        MATCH (start:Room {id: $start_node_id})
        MATCH (exit:Room {type: 'Exit'})
        // Basic Cypher shortestPath matching only safe nodes
        MATCH path = shortestPath((start)-[:CONNECTS_TO*..30]-(exit))
        WHERE ALL(node IN nodes(path) WHERE node.safe = True)
        RETURN
            [node IN nodes(path) | node.id] AS route,
            length(path) AS cost
        ORDER BY cost ASC LIMIT 1
        """
        
        result = await session.run(query, start_node_id=start_node_id)
        record = await result.single()
        
        if record:
            return {"route": record["route"], "cost": record["cost"]}
        return None

graph_engine = GraphEngine()
