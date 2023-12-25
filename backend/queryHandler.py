import MySQLdb
import threading
import os
from dotenv import load_dotenv
import sshtunnel
from datetime import datetime

load_dotenv()

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASS = os.getenv("MYSQL_PASS")
MYSQL_DB = os.getenv("MYSQL_DB")
MYSQL_CA_LOCATION = os.getenv("MYSQL_CA_LOCATION")
MYSQL_SSH_PASS = os.getenv("MYSQL_SSH_PASS")
MYSQL_SSH_USER = os.getenv("MYSQL_SSH_USER")

class ConnectToMySQL(threading.local):
    def __init__(self):
        self.ca_location = MYSQL_CA_LOCATION if 'PYTHONANYWHERE_DOMAIN' in os.environ else 'cacert.pem'

        """
        self.conn = MySQLdb.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            passwd=MYSQL_PASS,
            db=MYSQL_DB,

        )
                    ssl_mode="VERIFY_IDENTITY",
            ssl={
                'ca': self.ca_location
            },
        """
        if 'PYTHONANYWHERE_DOMAIN' in os.environ:
            self.conn = MySQLdb.connect(
                host=MYSQL_HOST,
                user=MYSQL_USER,
                passwd=MYSQL_PASS,
                db=MYSQL_DB,

            )
        else:
            self.tunnel = sshtunnel.SSHTunnelForwarder(
                ('ssh.pythonanywhere.com'),
                ssh_username = MYSQL_SSH_USER, ssh_password = MYSQL_SSH_PASS,
                remote_bind_address=(MYSQL_HOST, 3306)
            )
            self.tunnel.start()
            self.conn = MySQLdb.connect(
                user=MYSQL_USER,
                passwd=MYSQL_PASS,
                host='127.0.0.1', port=self.tunnel.local_bind_port,
                db=MYSQL_DB,
            )
        self.conn.autocommit(True)
        self.cur = self.conn.cursor()

    def close_connection(self):
        # Close cursor and connection to database
        self.cur.close()
        self.conn.close()

    def reconnect(self):
        self.cur.close()
        self.conn.close()
        if 'PYTHONANYWHERE_DOMAIN' in os.environ:
            self.conn = MySQLdb.connect(
                host=MYSQL_HOST,
                user=MYSQL_USER,
                passwd=MYSQL_PASS,
                db=MYSQL_DB,

            )
        else:
            self.tunnel = sshtunnel.SSHTunnelForwarder(
                ('ssh.pythonanywhere.com'),
                ssh_username = MYSQL_SSH_USER, ssh_password = MYSQL_SSH_PASS,
                remote_bind_address=(MYSQL_HOST, 3306)
            )
            self.tunnel.start()
            self.conn = MySQLdb.connect(
                user=MYSQL_USER,
                passwd=MYSQL_PASS,
                host='127.0.0.1', port=self.tunnel.local_bind_port,
                db=MYSQL_DB,
            )
        self.conn.autocommit(True)
        self.cur = self.conn.cursor()

    def create_new_user(self, user_id, display_name, email):
        query = """
            INSERT INTO Users (user_id, display_name, email, date_created)
            VALUES (%s, %s, %s, NOW());
        """
        try:
            self.cur.execute(query, [user_id, display_name, email])
            self.conn.commit()
        except (AttributeError, MySQLdb.OperationalError):
            self.reconnect()
            self.cur.execute(query, [user_id, display_name, email])
            self.conn.commit()
        except Exception as e:
            return {'status': False, 'message': str(e)}, 400

        if self.cur.rowcount >= 0:
            print(f'User with id {str(user_id)} successfully created!')
            return {'status': True, 'message': f'User with id {str(user_id)} successfully created!'}, 200
        else:
            print(f'User with id {str(user_id)} failed to create.')
            return {'status': True, 'message': f'User with id {str(user_id)} failed to create.'}, 400

    def upload_score(self, user_id, score, amount_of_elements):
        query = """
            INSERT INTO Scores (user_id, time, score, amount_of_elements)
            VALUES (%s, NOW(), %s, %s);
        """
        try:
            self.cur.execute(query, [user_id, score, amount_of_elements])
            self.conn.commit()
        except (AttributeError, MySQLdb.OperationalError):
            self.reconnect()
            self.cur.execute(query, [user_id, score, amount_of_elements])
            self.conn.commit()
        except Exception as e:
            return {'status': False, 'message': str(e)}, 400

        if self.cur.rowcount >= 0:
            print(f'Score from user id {str(user_id)} successfully created!')
            return {'status': True, 'message': f'Score from user id {str(user_id)} successfully created!'}, 200
        else:
            print(f'Score from user id {str(user_id)} failed to create.')
            return {'status': True, 'message': f'Score from user id {str(user_id)} failed to create.'}, 400

    def get_user_scores(self, user_id = None, email = None):
            search_term = user_id if user_id else email
            if user_id:
                query = """
                    SELECT *
                    FROM Scores
                    WHERE user_id = %s
                    ORDER BY score ASC;
                """
            else:
                query = """
                    SELECT *
                    FROM Scores
                    WHERE email = %s
                    ORDER BY score ASC;
                """
            scores = {}
            try:
                self.cur.execute(query, [search_term])
                self.conn.commit()

                result = self.cur.fetchall()
            except (AttributeError, MySQLdb.OperationalError):
                self.reconnect()
                self.cur.execute(query, [search_term])
                self.conn.commit()

                result = self.cur.fetchall()
            except Exception as e:
                return {'status': False, 'message': str(e)}, 400
            
            for score in result:
                _, user_id, time, score, amount_of_elements, _, display_name, email, _ = score
            formatted_date = time.strftime("%a, %d %b %Y")
            scores.append({
                'time_of_score': formatted_date,
                'score': score,
                'amount_of_elements': amount_of_elements,
                'user_id': user_id,
                'display_name': display_name,
                'email': email
                })
            
            return {'status': True, 'result': scores}, 200
    
    def get_best_scores(self, amount_of_elements):
        query = """
            SELECT *
            FROM Scores S
            INNER JOIN Users U ON S.user_id = U.user_id
            WHERE amount_of_elements = %s
            ORDER BY score ASC
            LIMIT 50;
        """
        scores = []
        try:
            self.cur.execute(query, [amount_of_elements])
            self.conn.commit()

            result = self.cur.fetchall()
        except (AttributeError, MySQLdb.OperationalError):
            self.reconnect()
            self.cur.execute(query, [amount_of_elements])
            self.conn.commit()

            result = self.cur.fetchall()
        except Exception as e:
            return {'status': False, 'message': str(e)}, 400
        
        for score in result:
            _, user_id, time, score, amount_of_elements, _, display_name, email, _ = score
            #print(type(time))
            formatted_date = time.strftime("%a, %d %b %Y")
            scores.append({
                'time_of_score': formatted_date,
                'score': score,
                'amount_of_elements': amount_of_elements,
                'user_id': user_id,
                'display_name': display_name,
                'email': email
                })
        return {'status': True, 'result': scores}, 200

    def get_all_scores(self):
        similarity_query = """
            SELECT * FROM Scores;
        """
        self.cur.execute(similarity_query)
        self.conn.commit()

        # Fetch and print the results
        result = self.cur.fetchall()
        print(result)
        return result
        results = {}
        for product in result:
            product_hashed = product[1]
            if product_hashed in results:
                results[product_hashed].append(product[2])
            else:
                results[product_hashed] = [product[2]]
        products = [{"name": product_name, "ingredient_ids": results[product_name]} for product_name in results]
        products_sorted = sorted(products, key=lambda d: len(d['ingredient_ids']), reverse=True)
        return products_sorted